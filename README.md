# Meeting Room Booking App

A full-stack meeting room booking system. Users can browse rooms, book time slots, and manage their bookings. The backend prevents double-booking with database transactions and row locking.

## Tech Stack

- Backend: Laravel 11 (REST API), Laravel Sanctum (token auth), MySQL 8
- Frontend: React 18, TypeScript, Vite, Tailwind CSS, React Query, React Hook Form + Zod
- Infrastructure: Docker and Docker Compose

## Features

- Register, login, and logout with token authentication
- Browse meeting rooms with capacity and location
- Create, view, and cancel bookings
- Booking conflict prevention (no two bookings for the same room and time)
- Authorization with Laravel Policies (users manage only their own bookings)
- Service layer architecture
- English and Arabic UI, light and dark themes

## Run with Docker

Requirements: Docker Desktop only. No PHP, Composer, Node, or MySQL needed.

1. Clone the repository

```bash
git clone https://github.com/yehiak257-ctrl/fullstack-meeting-room-booking-app.git
cd fullstack-meeting-room-booking-app
```

2. Create the environment files

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Build and start all services

```bash
docker compose up -d --build
```

4. Prepare the database (first run only; wait about 30 seconds for MySQL to start)

```bash
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate --seed
```

5. Open the app

- Frontend: http://localhost:5173
- API: http://localhost:8000/api/rooms

Register a new account from the UI, then book a room.

## Useful Commands

```bash
docker compose ps                  # list running containers
docker compose logs -f app         # follow backend logs
docker compose down                # stop everything
docker compose down -v             # stop and delete the database volume
```

## Project Structure

```
.
├── backend/              Laravel API (Dockerfile inside)
├── frontend/             React + Vite app (Dockerfile inside)
└── docker-compose.yml    db + app + frontend services
```

## Docker Services

| Service  | Description              | Port |
|----------|--------------------------|------|
| db       | MySQL 8.0                | -    |
| app      | Laravel API              | 8000 |
| frontend | Vite dev server (React)  | 5173 |

## Author

Yehia Kamel Yehia - [LinkedIn](https://linkedin.com/in/yehia-kamel-86469b411) - [GitHub](https://github.com/yehiak257-ctrl)
