import { apiConfig, endpoints } from '@/services/api/apiConfig'
import { httpClient } from '@/services/api/httpClient'
import { mapRoomDto, mapLaravelPagination } from '@/utils/mappers'
import { mockRooms, getNextRoomId } from '@/mocks/data'
import type {
  Room,
  RoomFilters,
  PaginatedResponse,
  CreateRoomPayload,
  UpdateRoomPayload,
  RoomDto,
} from '@/types'

const MOCK_DELAY = 400

function delay(ms = MOCK_DELAY) {
  return new Promise((r) => setTimeout(r, ms))
}

export async function getRooms(filters: RoomFilters = {}): Promise<PaginatedResponse<Room>> {
  if (apiConfig.useMockData) {
    await delay()
    let list = [...mockRooms]
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          (r.description?.toLowerCase().includes(q) ?? false)
      )
    }
    if (filters.location) {
      list = list.filter((r) => r.location.toLowerCase().includes(filters.location!.toLowerCase()))
    }
    if (filters.minCapacity) {
      list = list.filter((r) => r.capacity >= filters.minCapacity!)
    }
    if (filters.maxCapacity) {
      list = list.filter((r) => r.capacity <= filters.maxCapacity!)
    }
    if (filters.sortBy === 'name') {
      list.sort((a, b) =>
        filters.sortDir === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
      )
    } else if (filters.sortBy === 'capacity') {
      list.sort((a, b) =>
        filters.sortDir === 'desc' ? b.capacity - a.capacity : a.capacity - b.capacity
      )
    }
    const page = filters.page ?? 1
    const perPage = filters.perPage ?? 9
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
  if (filters.search) params.search = filters.search
  if (filters.location) params.location = filters.location
  if (filters.minCapacity) params.min_capacity = filters.minCapacity
  if (filters.maxCapacity) params.max_capacity = filters.maxCapacity
  if (filters.page) params.page = filters.page
  if (filters.perPage) params.per_page = filters.perPage
  if (filters.sortBy) params.sort_by = filters.sortBy
  if (filters.sortDir) params.sort_dir = filters.sortDir

  const { data } = await httpClient.get(endpoints.rooms, { params })
  // Support both paginated and plain array
  if (Array.isArray(data)) {
    return {
      data: data.map(mapRoomDto),
      meta: { currentPage: 1, lastPage: 1, perPage: data.length, total: data.length },
    }
  }
  return mapLaravelPagination(data, mapRoomDto)
}

export async function getRoomById(id: string | number): Promise<Room> {
  if (apiConfig.useMockData) {
    await delay()
    const room = mockRooms.find((r) => String(r.id) === String(id))
    if (!room) throw { message: 'Room not found', status: 404, code: 'not_found' }
    return room
  }
  const { data } = await httpClient.get(endpoints.room(id))
  return mapRoomDto(data.data ?? data)
}

export async function createRoom(payload: CreateRoomPayload): Promise<Room> {
  if (apiConfig.useMockData) {
    await delay(600)
    const newRoom: Room = {
      id: getNextRoomId(),
      name: payload.name,
      capacity: payload.capacity,
      location: payload.location,
      description: payload.description ?? null,
      amenities: payload.amenities ?? null,
      imageUrl: null,
      isAvailable: true,
    }
    mockRooms.push(newRoom)
    return newRoom
  }
  // Support FormData for image upload
  if (payload.image instanceof File) {
    const form = new FormData()
    form.append('name', payload.name)
    form.append('capacity', String(payload.capacity))
    form.append('location', payload.location)
    if (payload.description) form.append('description', payload.description)
    if (payload.amenities) form.append('amenities', JSON.stringify(payload.amenities))
    form.append('image', payload.image)
    const { data } = await httpClient.post(endpoints.rooms, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return mapRoomDto(data.data ?? data)
  }
  const { data } = await httpClient.post(endpoints.rooms, payload)
  return mapRoomDto(data.data ?? data)
}

export async function updateRoom(id: string | number, payload: UpdateRoomPayload): Promise<Room> {
  if (apiConfig.useMockData) {
    await delay(500)
    const idx = mockRooms.findIndex((r) => String(r.id) === String(id))
    if (idx === -1) throw { message: 'Room not found', status: 404 }
    mockRooms[idx] = { ...mockRooms[idx], ...payload, id: mockRooms[idx].id }
    return mockRooms[idx]
  }
  const { data } = await httpClient.put(endpoints.room(id), payload)
  return mapRoomDto(data.data ?? data)
}

export async function deleteRoom(id: string | number): Promise<void> {
  if (apiConfig.useMockData) {
    await delay(400)
    const idx = mockRooms.findIndex((r) => String(r.id) === String(id))
    if (idx === -1) throw { message: 'Room not found', status: 404 }
    mockRooms.splice(idx, 1)
    return
  }
  await httpClient.delete(endpoints.room(id))
}
