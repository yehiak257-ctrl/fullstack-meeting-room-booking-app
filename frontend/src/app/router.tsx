import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PublicLayout } from '@/layouts/PublicLayout'
import { UserLayout } from '@/layouts/UserLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'

// Pages
import { RoomsPage } from '@/pages/rooms/RoomsPage'
import { RoomDetailsPage } from '@/pages/rooms/RoomDetailsPage'
import { CreateBookingPage } from '@/pages/bookings/CreateBookingPage'
import { MyBookingsPage } from '@/pages/bookings/MyBookingsPage'
import { BookingDetailsPage } from '@/pages/bookings/BookingDetailsPage'
import { ProfilePage } from '@/pages/profile/ProfilePage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminRoomsPage } from '@/pages/admin/AdminRoomsPage'
import { AdminRoomFormPage } from '@/pages/admin/AdminRoomFormPage'
import { AdminBookingsPage } from '@/pages/admin/AdminBookingsPage'
import { AdminBookingDetailsPage } from '@/pages/admin/AdminBookingDetailsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Navigate to="/rooms" replace /> },
      { path: 'rooms', element: <RoomsPage /> },
      { path: 'rooms/:id', element: <RoomDetailsPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'bookings/create', element: <CreateBookingPage /> },
      { path: 'my-bookings', element: <MyBookingsPage /> },
      { path: 'my-bookings/:id', element: <BookingDetailsPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requireAdmin>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'rooms', element: <AdminRoomsPage /> },
      { path: 'rooms/create', element: <AdminRoomFormPage /> },
      { path: 'rooms/:id/edit', element: <AdminRoomFormPage /> },
      { path: 'bookings', element: <AdminBookingsPage /> },
      { path: 'bookings/:id', element: <AdminBookingDetailsPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/rooms" replace /> },
])
