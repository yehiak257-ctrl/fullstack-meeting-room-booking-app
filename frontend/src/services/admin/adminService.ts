import { apiConfig, endpoints } from '@/services/api/apiConfig'
import { httpClient } from '@/services/api/httpClient'
import { mockDashboardStats } from '@/mocks/data'
import type { DashboardStats } from '@/types'

const MOCK_DELAY = 350

function delay(ms = MOCK_DELAY) {
  return new Promise((r) => setTimeout(r, ms))
}

export async function getDashboardStats(): Promise<DashboardStats> {
  if (apiConfig.useMockData) {
    await delay()
    return { ...mockDashboardStats, isMock: true }
  }
  const { data } = await httpClient.get(endpoints.adminDashboard)
  const raw = data.data ?? data
  return {
    totalRooms: raw.total_rooms ?? raw.totalRooms ?? 0,
    totalBookings: raw.total_bookings ?? raw.totalBookings ?? 0,
    pendingBookings: raw.pending_bookings ?? raw.pendingBookings ?? 0,
    confirmedBookings: raw.confirmed_bookings ?? raw.confirmedBookings ?? 0,
    completedBookings: raw.completed_bookings ?? raw.completedBookings,
    cancelledBookings: raw.cancelled_bookings ?? raw.cancelledBookings,
    isMock: false,
  }
}
