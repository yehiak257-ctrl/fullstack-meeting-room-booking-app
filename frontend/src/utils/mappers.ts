import type {
  Room,
  RoomDto,
  Booking,
  BookingDto,
  User,
  UserDto,
  PaginationMeta,
  PaginatedResponse,
} from '@/types'

export function mapRoomDto(dto: RoomDto): Room {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? null,
    capacity: dto.capacity,
    location: dto.location,
    imageUrl: dto.image_url ?? dto.image ?? null,
    amenities: dto.amenities ?? null,
    isAvailable: dto.is_available ?? null,
    createdAt: dto.created_at ?? null,
    updatedAt: dto.updated_at ?? null,
  }
}

export function mapBookingDto(dto: BookingDto): Booking {
  return {
    id: dto.id,
    roomId: dto.room_id ?? dto.room?.id ?? '',
    roomName: dto.room_name ?? dto.room?.name ?? 'Unknown Room',
    roomLocation: dto.room_location ?? dto.room?.location ?? null,
    userId: dto.user_id ?? dto.user?.id ?? null,
    userName: dto.user_name ?? dto.user?.name ?? null,
    date: dto.date,
    startTime: normalizeTime(dto.start_time),
    endTime: normalizeTime(dto.end_time),
    status: dto.status,
    notes: dto.notes ?? null,
    createdAt: dto.created_at ?? null,
    updatedAt: dto.updated_at ?? null,
    canCancel: dto.can_cancel ?? (dto.status === 'pending' || dto.status === 'confirmed'),
    canConfirm: dto.can_confirm ?? dto.status === 'pending',
    canComplete: dto.can_complete ?? dto.status === 'confirmed',
  }
}

export function mapUserDto(dto: UserDto): User {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    role: dto.role ?? 'user',
    avatarUrl: dto.avatar_url ?? null,
    createdAt: dto.created_at ?? null,
  }
}

function normalizeTime(time: string): string {
  // Handle "HH:mm:ss" -> "HH:mm"
  if (time && time.length > 5) {
    return time.slice(0, 5)
  }
  return time
}

export function mapLaravelPagination<TDto, T>(
  response: {
    data: TDto[]
    meta?: {
      current_page: number
      last_page: number
      per_page: number
      total: number
      from?: number | null
      to?: number | null
    }
    links?: {
      first?: string | null
      last?: string | null
      prev?: string | null
      next?: string | null
    }
    current_page?: number
    last_page?: number
    per_page?: number
    total?: number
  },
  mapper: (dto: TDto) => T
): PaginatedResponse<T> {
  // Support both nested meta and top-level Laravel pagination
  const metaSource = response.meta ?? response
  const meta: PaginationMeta = {
    currentPage: metaSource.current_page ?? 1,
    lastPage: metaSource.last_page ?? 1,
    perPage: metaSource.per_page ?? 15,
    total: metaSource.total ?? response.data.length,
    from: metaSource.from ?? null,
    to: metaSource.to ?? null,
  }

  return {
    data: response.data.map(mapper),
    meta,
    links: response.links,
  }
}
