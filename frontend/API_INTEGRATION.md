# API Integration Guide

This document describes how the frontend expects to talk to a Laravel backend. **All endpoints and shapes are provisional examples.** Adjust `src/services/api/apiConfig.ts` and the mappers to match your actual routes and response formats.

## Configuration

| Setting | Location | Notes |
|---------|----------|-------|
| Base URL | `VITE_API_BASE_URL` | e.g. `http://127.0.0.1:8000/api` |
| Auth mode | `VITE_API_AUTH_MODE` | `sanctum` or `bearer` |
| Mock mode | `VITE_USE_MOCK_DATA` | Must be `false` for real API |
| Endpoint paths | `src/services/api/apiConfig.ts` → `endpoints` | Central place to change URLs |
| DTO → UI mapping | `src/utils/mappers.ts` | Handle snake_case / nested resources |
| HTTP client | `src/services/api/httpClient.ts` | Axios instance, CSRF, tokens, errors |

## Endpoint mapping table

| Feature | Method | Proposed endpoint | Auth | Notes |
|---------|--------|-------------------|------|-------|
| List rooms | GET | `/rooms` | Optional | Supports pagination & filters |
| Room detail | GET | `/rooms/{id}` | Optional | |
| Create room | POST | `/rooms` | Admin | Or `/admin/rooms` |
| Update room | PUT/PATCH | `/rooms/{id}` | Admin | |
| Delete room | DELETE | `/rooms/{id}` | Admin | |
| Create booking | POST | `/bookings` | User | Conflict → 409 or 422 |
| My bookings | GET | `/bookings` | User | Filter by current user on server |
| Booking detail | GET | `/bookings/{id}` | User/Admin | Ownership enforced server-side |
| Cancel booking | DELETE | `/bookings/{id}` | User | Or PATCH status |
| Admin bookings | GET | `/admin/bookings` | Admin | |
| Update booking status | PATCH | `/admin/bookings/{id}/status` | Admin | Body: `{ "status": "confirmed" }` |
| Dashboard stats | GET | `/admin/dashboard` | Admin | |
| Login | POST | `/login` | Public | Sanctum CSRF first if cookie mode |
| Register | POST | `/register` | Public | |
| Logout | POST | `/logout` | Auth | |
| Current user | GET | `/user` | Auth | |
| Profile | GET/PUT | `/profile` | Auth | Optional |

## Sample request / response shapes (examples only)

### GET /rooms (paginated)

Response (Laravel-style):

```json
{
  "data": [
    {
      "id": 1,
      "name": "Horizon Conference Room",
      "description": "...",
      "capacity": 20,
      "location": "Floor 12, East Wing",
      "image_url": "https://example.com/image.jpg",
      "amenities": ["Projector", "Whiteboard"],
      "is_available": true,
      "created_at": "2025-01-01T00:00:00.000000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 9,
    "total": 24,
    "from": 1,
    "to": 9
  }
}
```

### POST /bookings

Request:

```json
{
  "room_id": 1,
  "date": "2025-06-15",
  "start_time": "09:00",
  "end_time": "11:00",
  "notes": "Team planning"
}
```

Conflict (409 or 422):

```json
{
  "message": "This room is already booked for the selected time slot."
}
```

Validation (422):

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "end_time": ["The end time must be a date after start time."]
  }
}
```

### Login (Bearer example)

```json
{
  "token": "1|abcdef",
  "user": {
    "id": 1,
    "name": "Alex Morgan",
    "email": "alex@example.com",
    "role": "user"
  }
}
```

## Adapting field names

Update DTOs in `src/types/index.ts` and mappers in `src/utils/mappers.ts`. Do not change page components for field-name differences.

## CORS & CSRF (Laravel Sanctum)

- Set `supports_credentials` true in CORS config
- Set `SANCTUM_STATEFUL_DOMAINS` to your frontend origin
- Frontend calls `/sanctum/csrf-cookie` before login when auth mode is sanctum

## Switching off mock mode

```env
VITE_USE_MOCK_DATA=false
```

Restart the Vite dev server after changing environment variables.
