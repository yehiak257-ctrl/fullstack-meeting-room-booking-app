import { apiConfig, endpoints } from '@/services/api/apiConfig'
import { httpClient } from '@/services/api/httpClient'
import { mapBookingDto, mapLaravelPagination } from '@/utils/mappers'
import { mockBookings, mockRooms, getNextBookingId } from '@/mocks/data'
import type {
  Booking,
  BookingFilters,
  PaginatedResponse,
  CreateBookingPayload,
  BookingStatus,
} from '@/types'

const MOCK_DELAY = 450

function delay(ms = MOCK_DELAY) {
  return new Promise((r) => setTimeout(r, ms))
}

export async function getMyBookings(
  filters: BookingFilters = {}
): Promise<PaginatedResponse<Booking>> {
  if (apiConfig.useMockData) {
    await delay()
    let list = mockBookings.filter((b) => b.userId === 1) // current mock user
    if (filters.status) {
      list = list.filter((b) => b.status === filters.status)
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(
        (b) =>
          b.roomName.toLowerCase().includes(q) ||
          String(b.id).includes(q) ||
          (b.notes?.toLowerCase().includes(q) ?? false)
      )
    }
    if (filters.dateFrom) {
      list = list.filter((b) => b.date >= filters.dateFrom!)
    }
    if (filters.dateTo) {
      list = list.filter((b) => b.date <= filters.dateTo!)
    }
    list.sort((a, b) => b.date.localeCompare(a.date) || a.startTime.localeCompare(b.startTime))
    const page = filters.page ?? 1
    const perPage = filters.perPage ?? 10
    const start = (page - 1) * perPage
    const data = list.slice(start, start + perPage)
    return {
      data,
      meta: {
        currentPage: page,
        lastPage: Math.max(1, Math.ceil(list.length / perPage)),
        perPage,
        total: list.length,
        from: list.length ? start + 1 : null,
        to: Math.min(start + perPage, list.length),
      },
    }
  }

  const params: Record<string, string | number> = {}
  if (filters.status) params.status = filters.status
  if (filters.search) params.search = filters.search
  if (filters.dateFrom) params.date_from = filters.dateFrom
  if (filters.dateTo) params.date_to = filters.dateTo
  if (filters.page) params.page = filters.page
  if (filters.perPage) params.per_page = filters.perPage

  const { data } = await httpClient.get(endpoints.myBookings, { params })
  if (Array.isArray(data)) {
    return {
      data: data.map(mapBookingDto),
      meta: { currentPage: 1, lastPage: 1, perPage: data.length, total: data.length },
    }
  }
  return mapLaravelPagination(data, mapBookingDto)
}

export async function getBookingById(id: string | number): Promise<Booking> {
  if (apiConfig.useMockData) {
    await delay()
    const booking = mockBookings.find((b) => String(b.id) === String(id))
    if (!booking) throw { message: 'Booking not found', status: 404, code: 'not_found' }
    return booking
  }
  const { data } = await httpClient.get(endpoints.booking(id))
  return mapBookingDto(data.data ?? data)
}

export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  if (apiConfig.useMockData) {
    await delay(700)
    // Simple conflict check for demo
    const conflict = mockBookings.some(
      (b) =>
        String(b.roomId) === String(payload.room_id) &&
        b.date === payload.date &&
        b.status !== 'cancelled' &&
        !(payload.end_time <= b.startTime || payload.start_time >= b.endTime)
    )
    if (conflict) {
      throw {
        message: 'This room is already booked for the selected time slot. Please choose another time.',
        status: 409,
        code: 'conflict',
      }
    }
    if (payload.end_time <= payload.start_time) {
      throw {
        message: 'Validation failed',
        status: 422,
        errors: { end_time: ['End time must be after start time.'] },
      }
    }
    const room = mockRooms.find((r) => String(r.id) === String(payload.room_id))
    const newBooking: Booking = {
      id: getNextBookingId(),
      roomId: payload.room_id,
      roomName: room?.name ?? 'Unknown Room',
      roomLocation: room?.location ?? null,
      userId: 1,
      userName: 'Alex Morgan',
      date: payload.date,
      startTime: payload.start_time,
      endTime: payload.end_time,
      status: 'pending',
      notes: payload.notes ?? null,
      createdAt: new Date().toISOString(),
      canCancel: true,
      canConfirm: true,
      canComplete: false,
    }
    mockBookings.unshift(newBooking)
    return newBooking
  }

  const { data } = await httpClient.post(endpoints.bookings, payload)
  return mapBookingDto(data.data ?? data)
}

export async function cancelBooking(id: string | number): Promise<Booking> {
  if (apiConfig.useMockData) {
    await delay(500)
    const idx = mockBookings.findIndex((b) => String(b.id) === String(id))
    if (idx === -1) throw { message: 'Booking not found', status: 404 }
    if (!mockBookings[idx].canCancel) {
      throw { message: 'This booking cannot be cancelled.', status: 403, code: 'forbidden' }
    }
    mockBookings[idx] = {
      ...mockBookings[idx],
      status: 'cancelled',
      canCancel: false,
      canConfirm: false,
      canComplete: false,
    }
    return mockBookings[idx]
  }
  const { data } = await httpClient.patch(endpoints.bookingCancel(id))
  return mapBookingDto(data.data ?? data)
}

// Admin
export async function getAdminBookings(
  filters: BookingFilters = {}
): Promise<PaginatedResponse<Booking>> {
  if (apiConfig.useMockData) {
    await delay()
    let list = [...mockBookings]
    if (filters.status) list = list.filter((b) => b.status === filters.status)
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(
        (b) =>
          b.roomName.toLowerCase().includes(q) ||
          String(b.id).includes(q) ||
          (b.userName?.toLowerCase().includes(q) ?? false)
      )
    }
    if (filters.roomId) list = list.filter((b) => String(b.roomId) === String(filters.roomId))
    const page = filters.page ?? 1
    const perPage = filters.perPage ?? 15
    const start = (page - 1) * perPage
    const data = list.slice(start, start + perPage)
    return {
      data,
      meta: {
        currentPage: page,
        lastPage: Math.max(1, Math.ceil(list.length / perPage)),
        perPage,
        total: list.length,
        from: list.length ? start + 1 : null,
        to: Math.min(start + perPage, list.length),
      },
    }
  }
  const params: Record<string, string | number> = {}
  if (filters.status) params.status = filters.status
  if (filters.search) params.search = filters.search
  if (filters.roomId) params.room_id = filters.roomId as number
  if (filters.page) params.page = filters.page
  if (filters.perPage) params.per_page = filters.perPage
  const { data } = await httpClient.get(endpoints.adminBookings, { params })
  return mapLaravelPagination(data, mapBookingDto)
}

export async function updateBookingStatus(
  id: string | number,
  status: BookingStatus
): Promise<Booking> {
  if (apiConfig.useMockData) {
    await delay(500)
    const idx = mockBookings.findIndex((b) => String(b.id) === String(id))
    if (idx === -1) throw { message: 'Booking not found', status: 404 }
    mockBookings[idx] = {
      ...mockBookings[idx],
      status,
      canCancel: status === 'pending' || status === 'confirmed',
      canConfirm: status === 'pending',
      canComplete: status === 'confirmed',
    }
    return mockBookings[idx]
  }
  const { data } = await httpClient.patch(endpoints.adminBookingStatus(id), { status })
  return mapBookingDto(data.data ?? data)
}
