# RoomBook — Room Booking Management Frontend

Production-ready React frontend for a meeting room reservation system. Designed to integrate cleanly with a Laravel 11 REST API.

## Tech Stack

- React 18 + TypeScript
- Vite 6
- Tailwind CSS 4
- React Router 7
- TanStack Query (React Query) 5
- React Hook Form + Zod
- Axios
- Lucide React icons
- Sonner (toasts)
- i18next (English + Arabic, RTL)
- Light / Dark theme

## Prerequisites

- Node.js 18+ (recommended 20+)
- npm 9+

## Installation

```bash
cp .env.example .env
npm install
```

## Run locally

```bash
npm run dev
```

Open http://localhost:5173

## Production build

```bash
npm run build
npm run preview
```

## Mock mode (default)

`VITE_USE_MOCK_DATA=true` (default in `.env.example`)

- Fully functional UI without a backend
- Demo login: `alex@example.com` / `password` (user) or `admin@example.com` / `password` (admin)
- Any email/password also works for quick testing
- Mock data is clearly labeled in the UI

## Switch to real Laravel API

1. Set in `.env`:

```env
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_API_AUTH_MODE=sanctum   # or bearer
```

2. Ensure Laravel CORS allows your frontend origin and credentials if using Sanctum.
3. Restart the Vite dev server.

**Important:** In real API mode, failed requests show real errors. There is no silent fallback to mock data.

## Configuration reference

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Laravel API base (e.g. `http://127.0.0.1:8000/api`) |
| `VITE_API_AUTH_MODE` | `sanctum` (cookie) or `bearer` (token) |
| `VITE_USE_MOCK_DATA` | `true` / `false` |
| `VITE_APP_NAME` | Display name |
| `VITE_DEFAULT_LANGUAGE` | `en` or `ar` |
| `VITE_DEFAULT_THEME` | `light`, `dark`, or `system` |

## Project structure

```
src/
  app/           # App shell, router, providers
  components/    # UI primitives + domain components
  features/      # Auth context, theme
  layouts/       # Public, User, Admin layouts
  pages/         # Route-level pages
  services/      # API client + domain services
  schemas/       # Zod form schemas
  types/         # TypeScript interfaces
  mocks/         # Mock data (isolated)
  hooks/         # Shared hooks (extend as needed)
  i18n/          # Translations
  utils/         # cn, mappers
  styles/        # Global CSS + theme tokens
```

## Endpoint configuration

All paths live in `src/services/api/apiConfig.ts` (`endpoints` object).

Request/response mapping lives in `src/utils/mappers.ts` and individual services.

See **API_INTEGRATION.md** for the full endpoint mapping table, sample payloads, and Laravel notes.

## Authentication

### Sanctum (cookie)

1. `VITE_API_AUTH_MODE=sanctum`
2. Frontend calls `/sanctum/csrf-cookie` before login/register (see `ensureCsrfCookie`)
3. Axios uses `withCredentials: true`
4. Laravel must set `SANCTUM_STATEFUL_DOMAINS` and proper CORS `supports_credentials`

### Bearer token

1. `VITE_API_AUTH_MODE=bearer`
2. Login response should include `token` or `access_token`
3. Token is stored in `localStorage` and attached as `Authorization: Bearer …`

## Features requiring backend support

| Feature | Backend needed |
|---------|----------------|
| Real room list / details | Yes |
| Create booking + conflict detection | Yes (authoritative) |
| My bookings / ownership | Yes |
| Cancel booking | Yes |
| Admin dashboard stats | Optional (mock works) |
| Admin room CRUD | Yes |
| Admin booking status changes | Yes |
| Profile update | Optional |
| Image upload for rooms | Optional (FormData ready) |

## Error handling

The HTTP client normalizes:

- 401 → unauthenticated message + login redirect for protected routes
- 403 → forbidden message
- 404 → not found
- 422 → field-level validation errors (Laravel `errors` object)
- 409 / conflict messages → user-friendly conflict toast
- Network failures → generic recoverable message

## Theme & language

- Theme toggle cycles light → dark → system (persisted)
- Language toggle switches EN ↔ AR with RTL layout (persisted)

## Scripts

```bash
npm run dev        # development
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run preview    # preview production build
```

## Known limitations

- Image upload UI is prepared in the service layer; admin form currently accepts text amenities (comma-separated). Extend the form with a file input when your API is ready.
- Charts on the admin dashboard are omitted; only summary cards are shown.
- User management (`/admin/users`) is not implemented because it is optional.
- Availability indicator on room cards uses `is_available` when provided; it does not invent availability from bookings on the client.

## License

Private / internal use. Adapt as needed for your Laravel project.
