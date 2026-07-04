# Aurelius — Luxury Real Estate Platform

A full-stack luxury real estate application with a cinematic React frontend and a Laravel REST API backend.

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, GSAP, Lenis, Framer Motion, Swiper.js, React Router, Axios

**Backend:** Laravel 12, Laravel Sanctum, MySQL

## Project Structure

```
realestate/
├── frontend/     # React SPA (port 5173)
└── backend/      # Laravel API (port 8000)
```

## Prerequisites

- Node.js 18+
- PHP 8.2+
- Composer
- MySQL 8+

## Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Create a MySQL database:

```sql
CREATE DATABASE aurelius_realestate;
```

Update `.env` with your database credentials:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=aurelius_realestate
DB_USERNAME=root
DB_PASSWORD=your_password
```

Run migrations and seed luxury property data:

```bash
php artisan migrate
php artisan db:seed
php artisan storage:link
php artisan serve
```

The API will be available at `http://localhost:8000`.

### Default Accounts

| Role  | Email               | Password |
|-------|---------------------|----------|
| Admin | admin@aurelius.com  | password |
| User  | user@aurelius.com   | password |

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app will be available at `http://localhost:5173`.

## API Endpoints

### Public
- `POST /api/register` — User registration
- `POST /api/login` — User login
- `GET /api/properties` — List properties (paginated)
- `GET /api/properties/featured` — Featured properties
- `GET /api/properties/showcase` — Showcase properties (horizontal scroll)
- `GET /api/properties/{id}` — Property details
- `GET /api/testimonials` — Client testimonials
- `POST /api/inquiries` — Submit contact inquiry

### Authenticated (Bearer token)
- `POST /api/logout`
- `GET /api/user`
- `GET /api/favorites`
- `POST /api/favorites/{propertyId}`

### Admin Only
- `POST /api/properties` — Create property
- `PUT /api/properties/{id}` — Update property
- `DELETE /api/properties/{id}` — Delete property
- `POST /api/properties/{id}/images` — Upload image
- `DELETE /api/properties/{id}/images/{imageId}` — Delete image
- `GET /api/inquiries` — List inquiries
- `PATCH /api/inquiries/{id}` — Update inquiry status
- `GET /api/admin/stats` — Dashboard statistics
- `GET /api/admin/users` — List users

## Features

### Frontend
- Cinematic hero with video background and letter-reveal typography
- GSAP horizontal scroll property showcase
- API-driven featured property cards with hover animations
- Scroll-triggered storytelling section
- Property details with Swiper gallery
- Client testimonials
- Contact form with Google Maps
- Lenis smooth scrolling
- Admin dashboard for property and inquiry management

### Backend
- Laravel Sanctum token authentication
- Full property CRUD with image management
- Cloudinary integration (optional, falls back to local storage)
- Inquiry management
- Favorites system
- Admin role-based access control
- MySQL with proper foreign key relationships

## Cloudinary (Optional)

Add to `backend/.env`:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Without Cloudinary credentials, images upload to local `storage/app/public`.

## Production Build

```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && php artisan config:cache && php artisan route:cache
```

Serve the frontend `dist/` folder via your web server and point API requests to the Laravel backend.
