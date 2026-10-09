// =============================================================================
// Core domain types (UI models)
// =============================================================================

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Room {
  id: number | string;
  name: string;
  description?: string | null;
  capacity: number;
  location: string;
  imageUrl?: string | null;
  amenities?: string[] | null;
  isAvailable?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface Booking {
  id: number | string;
  roomId: number | string;
  roomName: string;
  roomLocation?: string | null;
  userId?: number | string | null;
  userName?: string | null;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: BookingStatus;
  notes?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  canCancel?: boolean;
  canConfirm?: boolean;
  canComplete?: boolean;
}

export interface User {
  id: number | string;
  name: string;
  email: string;
  role?: 'user' | 'admin' | string;
  avatarUrl?: string | null;
  createdAt?: string | null;
}

export interface PaginationMeta {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  from?: number | null;
  to?: number | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  links?: {
    first?: string | null;
    last?: string | null;
    prev?: string | null;
    next?: string | null;
  };
}

// =============================================================================
// API DTOs (can differ from UI models)
// =============================================================================

export interface RoomDto {
  id: number | string;
  name: string;
  description?: string | null;
  capacity: number;
  location: string;
  image_url?: string | null;
  image?: string | null;
  amenities?: string[] | null;
  is_available?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface BookingDto {
  id: number | string;
  room_id: number | string;
  room?: {
    id: number | string;
    name: string;
    location?: string | null;
  } | null;
  room_name?: string | null;
  room_location?: string | null;
  user_id?: number | string | null;
  user?: {
    id: number | string;
    name: string;
  } | null;
  user_name?: string | null;
  date: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  can_cancel?: boolean;
  can_confirm?: boolean;
  can_complete?: boolean;
}

export interface UserDto {
  id: number | string;
  name: string;
  email: string;
  role?: string;
  avatar_url?: string | null;
  created_at?: string | null;
}

// =============================================================================
// Request payloads
// =============================================================================

export interface CreateBookingPayload {
  room_id: number | string;
  date: string;
  start_time: string;
  end_time: string;
  notes?: string;
}

export interface CreateRoomPayload {
  name: string;
  capacity: number;
  location: string;
  description?: string;
  amenities?: string[];
  image?: File | null;
}

export interface UpdateRoomPayload extends Partial<CreateRoomPayload> {}

export interface UpdateBookingStatusPayload {
  status: BookingStatus;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
}

// =============================================================================
// Filters & params
// =============================================================================

export interface RoomFilters {
  search?: string;
  location?: string;
  minCapacity?: number;
  maxCapacity?: number;
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface BookingFilters {
  search?: string;
  status?: BookingStatus | '';
  roomId?: number | string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  perPage?: number;
}

// =============================================================================
// API error
// =============================================================================

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
  code?: string;
}

// =============================================================================
// Dashboard stats
// =============================================================================

export interface DashboardStats {
  totalRooms: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings?: number;
  cancelledBookings?: number;
  isMock?: boolean;
}

// =============================================================================
// Auth
// =============================================================================

export type AuthMode = 'sanctum' | 'bearer';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token?: string | null;
}
