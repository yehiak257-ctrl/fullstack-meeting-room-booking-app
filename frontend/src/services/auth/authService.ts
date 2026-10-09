import { apiConfig, endpoints } from '@/services/api/apiConfig'
import {
  httpClient,
  ensureCsrfCookie,
  setStoredToken,
  getStoredToken,
} from '@/services/api/httpClient'
import { mapUserDto } from '@/utils/mappers'
import { mockUsers } from '@/mocks/data'
import type { User, LoginPayload, RegisterPayload } from '@/types'

const MOCK_DELAY = 500
const MOCK_USER_KEY = 'room_booking_mock_user'

function delay(ms = MOCK_DELAY) {
  return new Promise((r) => setTimeout(r, ms))
}

function getMockUser(): User | null {
  try {
    const raw = localStorage.getItem(MOCK_USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function setMockUser(user: User | null) {
  try {
    if (user) localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(MOCK_USER_KEY)
  } catch {
    // ignore
  }
}

export async function login(credentials: LoginPayload): Promise<User> {
  if (apiConfig.useMockData) {
    await delay()
    // Demo credentials
    if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
      const user = mockUsers.find((u) => u.role === 'admin')!
      setMockUser(user)
      return user
    }
    if (credentials.email === 'alex@example.com' && credentials.password === 'password') {
      const user = mockUsers.find((u) => u.role === 'user')!
      setMockUser(user)
      return user
    }
    // Accept any email/password for demo convenience
    if (credentials.email && credentials.password) {
      const user: User = {
        id: 99,
        name: credentials.email.split('@')[0],
        email: credentials.email,
        role: credentials.email.includes('admin') ? 'admin' : 'user',
      }
      setMockUser(user)
      return user
    }
    throw { message: 'Invalid credentials', status: 401, code: 'unauthenticated' }
  }

  if (apiConfig.authMode === 'sanctum') {
    await ensureCsrfCookie()
  }

  const { data } = await httpClient.post(endpoints.login, credentials)

  // Bearer token response shape varies; common patterns:
  // { token: "...", user: {...} } or { access_token: "...", user: {...} } or just user + Set-Cookie
  if (apiConfig.authMode === 'bearer') {
    const token = data.token ?? data.access_token ?? data.data?.token
    if (token) setStoredToken(token)
  }

  const userData = data.user ?? data.data?.user ?? data.data ?? data
  return mapUserDto(userData)
}

export async function register(payload: RegisterPayload): Promise<User> {
  if (apiConfig.useMockData) {
    await delay()
    const user: User = {
      id: Date.now(),
      name: payload.name,
      email: payload.email,
      role: 'user',
    }
    setMockUser(user)
    return user
  }

  if (apiConfig.authMode === 'sanctum') {
    await ensureCsrfCookie()
  }

  const { data } = await httpClient.post(endpoints.register, payload)
  if (apiConfig.authMode === 'bearer') {
    const token = data.token ?? data.access_token ?? data.data?.token
    if (token) setStoredToken(token)
  }
  const userData = data.user ?? data.data?.user ?? data.data ?? data
  return mapUserDto(userData)
}

export async function logout(): Promise<void> {
  if (apiConfig.useMockData) {
    await delay(200)
    setMockUser(null)
    return
  }
  try {
    await httpClient.post(endpoints.logout)
  } finally {
    setStoredToken(null)
  }
}

export async function getCurrentUser(): Promise<User | null> {
  if (apiConfig.useMockData) {
    await delay(200)
    return getMockUser()
  }

  // Bearer: if no token, unauthenticated
  if (apiConfig.authMode === 'bearer' && !getStoredToken()) {
    return null
  }

  try {
    const { data } = await httpClient.get(endpoints.me)
    const userData = data.user ?? data.data ?? data
    return mapUserDto(userData)
  } catch (err: unknown) {
    const status = (err as { status?: number })?.status
    if (status === 401) return null
    throw err
  }
}

export async function getProfile(): Promise<User> {
  if (apiConfig.useMockData) {
    await delay()
    const user = getMockUser()
    if (!user) throw { message: 'Unauthenticated', status: 401 }
    return user
  }
  const { data } = await httpClient.get(endpoints.profile)
  return mapUserDto(data.data ?? data)
}

export async function updateProfile(payload: {
  name?: string
  email?: string
}): Promise<User> {
  if (apiConfig.useMockData) {
    await delay(500)
    const user = getMockUser()
    if (!user) throw { message: 'Unauthenticated', status: 401 }
    const updated = { ...user, ...payload }
    setMockUser(updated)
    return updated
  }
  const { data } = await httpClient.put(endpoints.profile, payload)
  return mapUserDto(data.data ?? data)
}
