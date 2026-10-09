import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import * as authService from '@/services/auth/authService'
import type { User, LoginPayload, RegisterPayload } from '@/types'
import { apiConfig } from '@/services/api/apiConfig'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isAdmin: boolean
  isMockMode: boolean
  login: (credentials: LoginPayload) => Promise<User>
  register: (data: RegisterPayload) => Promise<User>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const current = await authService.getCurrentUser()
      setUser(current)
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false))
  }, [refreshUser])

  const login = async (credentials: LoginPayload) => {
    const u = await authService.login(credentials)
    setUser(u)
    return u
  }

  const register = async (data: RegisterPayload) => {
    const u = await authService.register(data)
    setUser(u)
    return u
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAdmin: user?.role === 'admin',
        isMockMode: apiConfig.useMockData,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
