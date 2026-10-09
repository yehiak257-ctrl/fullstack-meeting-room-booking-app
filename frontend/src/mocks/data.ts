import type { Room, Booking, User, DashboardStats } from '@/types'

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Alex Morgan',
    email: 'alex@example.com',
    role: 'user',
    avatarUrl: null,
  },
  {
    id: 2,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    avatarUrl: null,
  },
]

export const mockRooms: Room[] = [
  {
    id: 1,
    name: 'Horizon Conference Room',
    description:
      'Spacious conference room with panoramic city views, perfect for executive meetings and presentations. Features state-of-the-art AV equipment.',
    capacity: 20,
    location: 'Floor 12, East Wing',
    imageUrl:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    amenities: ['Projector', 'Whiteboard', 'Video Conferencing', 'Coffee Machine'],
    isAvailable: true,
  },
  {
    id: 2,
    name: 'Focus Pod Alpha',
    description: 'Intimate space designed for focused collaboration. Ideal for small team stand-ups and brainstorming sessions.',
    capacity: 6,
    location: 'Floor 5, West Wing',
    imageUrl:
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop',
    amenities: ['TV Screen', 'Whiteboard', 'Standing Desks'],
    isAvailable: true,
  },
  {
    id: 3,
    name: 'Innovation Lab',
    description: 'Creative workspace with flexible furniture layout. Equipped for workshops, design sprints, and product demos.',
    capacity: 15,
    location: 'Floor 3, Innovation Hub',
    imageUrl:
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=600&fit=crop',
    amenities: ['Interactive Display', 'Whiteboard Walls', 'Modular Furniture', 'Sound System'],
    isAvailable: false,
  },
  {
    id: 4,
    name: 'Boardroom Elite',
    description: 'Premium boardroom with elegant furnishings and private dining capability. Reserved for high-level meetings.',
    capacity: 12,
    location: 'Floor 15, Executive Suite',
    imageUrl:
      'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&h=600&fit=crop',
    amenities: ['4K Display', 'Conference Phone', 'Catering Kitchen Access', 'Climate Control'],
    isAvailable: true,
  },
  {
    id: 5,
    name: 'Quiet Room 2B',
    description: 'Soundproof private room for confidential discussions or focused individual work.',
    capacity: 4,
    location: 'Floor 7, Quiet Zone',
    imageUrl:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop',
    amenities: ['Soundproofing', 'Desk Phone', 'Natural Light'],
    isAvailable: true,
  },
  {
    id: 6,
    name: 'Skyline Lounge',
    description: 'Relaxed meeting space with lounge seating and skyline views. Great for informal catch-ups and client receptions.',
    capacity: 10,
    location: 'Floor 18, Rooftop Level',
    imageUrl:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop',
    amenities: ['Lounge Seating', 'Mini Bar', 'Outdoor Terrace Access'],
    isAvailable: true,
  },
]

function todayPlus(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export const mockBookings: Booking[] = [
  {
    id: 101,
    roomId: 1,
    roomName: 'Horizon Conference Room',
    roomLocation: 'Floor 12, East Wing',
    userId: 1,
    userName: 'Alex Morgan',
    date: todayPlus(1),
    startTime: '09:00',
    endTime: '11:00',
    status: 'confirmed',
    notes: 'Quarterly planning session',
    createdAt: new Date().toISOString(),
    canCancel: true,
    canConfirm: false,
    canComplete: true,
  },
  {
    id: 102,
    roomId: 2,
    roomName: 'Focus Pod Alpha',
    roomLocation: 'Floor 5, West Wing',
    userId: 1,
    userName: 'Alex Morgan',
    date: todayPlus(2),
    startTime: '14:00',
    endTime: '15:30',
    status: 'pending',
    notes: null,
    createdAt: new Date().toISOString(),
    canCancel: true,
    canConfirm: true,
    canComplete: false,
  },
  {
    id: 103,
    roomId: 4,
    roomName: 'Boardroom Elite',
    roomLocation: 'Floor 15, Executive Suite',
    userId: 1,
    userName: 'Alex Morgan',
    date: todayPlus(-3),
    startTime: '10:00',
    endTime: '12:00',
    status: 'completed',
    notes: 'Client presentation',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    canCancel: false,
    canConfirm: false,
    canComplete: false,
  },
  {
    id: 104,
    roomId: 3,
    roomName: 'Innovation Lab',
    roomLocation: 'Floor 3, Innovation Hub',
    userId: 1,
    userName: 'Alex Morgan',
    date: todayPlus(-1),
    startTime: '13:00',
    endTime: '16:00',
    status: 'cancelled',
    notes: 'Cancelled due to schedule conflict',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    canCancel: false,
    canConfirm: false,
    canComplete: false,
  },
  {
    id: 105,
    roomId: 5,
    roomName: 'Quiet Room 2B',
    roomLocation: 'Floor 7, Quiet Zone',
    userId: 1,
    userName: 'Alex Morgan',
    date: todayPlus(5),
    startTime: '11:00',
    endTime: '12:00',
    status: 'confirmed',
    notes: null,
    createdAt: new Date().toISOString(),
    canCancel: true,
    canConfirm: false,
    canComplete: true,
  },
]

export const mockDashboardStats: DashboardStats = {
  totalRooms: mockRooms.length,
  totalBookings: mockBookings.length + 12,
  pendingBookings: 4,
  confirmedBookings: 9,
  completedBookings: 18,
  cancelledBookings: 3,
  isMock: true,
}

// Simple in-memory store for mock mutations
let nextBookingId = 200
let nextRoomId = 10

export function getNextBookingId() {
  return ++nextBookingId
}

export function getNextRoomId() {
  return ++nextRoomId
}
