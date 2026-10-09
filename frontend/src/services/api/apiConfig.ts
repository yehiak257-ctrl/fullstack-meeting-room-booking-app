import type { AuthMode } from '@/types'

const env = import.meta.env

export const apiConfig = {
  baseUrl: (env.VITE_API_BASE_URL as string) || 'http://127.0.0.1:8000/api',
  authMode: ((env.VITE_API_AUTH_MODE as string) || 'sanctum') as AuthMode,
  useMockData: (env.VITE_USE_MOCK_DATA as string) === 'true' || env.VITE_USE_MOCK_DATA === true,
  appName: (env.VITE_APP_NAME as string) || 'RoomBook',
  defaultLanguage: (env.VITE_DEFAULT_LANGUAGE as string) || 'en',
  defaultTheme: (env.VITE_DEFAULT_THEME as string) || 'system',
  timeout: 30000,
}

export const endpoints = {
  // Auth
  csrfCookie: '/sanctum/csrf-cookie', // usually outside /api
  login: '/login',
  register: '/register',
  logout: '/logout',
  me: '/user',
  // Rooms
  rooms: '/rooms',
  room: (id: string | number) => `/rooms/${id}`,
  // Bookings (user)
  bookings: '/bookings',
  booking: (id: string | number) => `/bookings/${id}`,
  myBookings: '/my-bookings',
  bookingCancel: (id: string | number) => `/bookings/${id}/cancel`,
  // Admin
  adminDashboard: '/admin/dashboard',
  adminRooms: '/admin/rooms',
  adminRoom: (id: string | number) => `/admin/rooms/${id}`,
  adminBookings: '/admin/bookings',
  adminBooking: (id: string | number) => `/admin/bookings/${id}`,
  adminBookingStatus: (id: string | number) => `/admin/bookings/${id}/status`,
  adminUsers: '/admin/users',
  // Profile
  profile: '/profile',
} as const

// Helper to build full URL for CSRF which is typically at domain root
export function getCsrfUrl(): string {
  const base = apiConfig.baseUrl.replace(/\/api\/?$/, '')
  return `${base}/sanctum/csrf-cookie`
}
