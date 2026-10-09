import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { apiConfig, getCsrfUrl } from './apiConfig'
import type { ApiError } from '@/types'

const TOKEN_KEY = 'room_booking_token'

let csrfInitialized = false

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  } catch {
    // ignore
  }
}

export function createHttpClient(): AxiosInstance {
  const client = axios.create({
    baseURL: apiConfig.baseUrl,
    timeout: apiConfig.timeout,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: apiConfig.authMode === 'sanctum',
  })

  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (apiConfig.authMode === 'bearer') {
      const token = getStoredToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  })

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const normalized = normalizeApiError(error)
      return Promise.reject(normalized)
    }
  )

  return client
}

export const httpClient = createHttpClient()

export async function ensureCsrfCookie(): Promise<void> {
  if (apiConfig.authMode !== 'sanctum' || csrfInitialized) {
    return
  }
  try {
    await axios.get(getCsrfUrl(), {
      withCredentials: true,
      headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    })
    csrfInitialized = true
  } catch {
    // CSRF init failure will surface on the next authenticated request
  }
}

export function normalizeApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const data = error.response?.data as Record<string, unknown> | undefined

    // Laravel validation errors (422)
    if (status === 422 && data?.errors && typeof data.errors === 'object') {
      return {
        message: (data.message as string) || 'Validation failed',
        status,
        errors: data.errors as Record<string, string[]>,
      }
    }

    // Conflict (409) or custom booking conflict
    if (status === 409 || (status === 422 && data?.message)) {
      return {
        message: (data?.message as string) || 'A conflict occurred with this booking.',
        status: status ?? 409,
        code: 'conflict',
      }
    }

    if (status === 401) {
      return {
        message: (data?.message as string) || 'Unauthenticated. Please log in again.',
        status: 401,
        code: 'unauthenticated',
      }
    }

    if (status === 403) {
      return {
        message: (data?.message as string) || 'You do not have permission to perform this action.',
        status: 403,
        code: 'forbidden',
      }
    }

    if (status === 404) {
      return {
        message: (data?.message as string) || 'Resource not found.',
        status: 404,
        code: 'not_found',
      }
    }

    return {
      message:
        (data?.message as string) ||
        error.message ||
        'An unexpected error occurred. Please try again.',
      status,
    }
  }

  if (error instanceof Error) {
    return { message: error.message }
  }

  return { message: 'An unexpected error occurred.' }
}

export function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'message' in error
}
