#!/usr/bin/env bash
set -e

echo "=== Aurelius Setup ==="

# Start MySQL via Docker if available
if command -v docker &> /dev/null; then
  echo "Starting MySQL container..."
  docker compose up -d mysql
  sleep 5
fi

# Backend
echo "Setting up backend..."
cd backend

if ! command -v composer &> /dev/null; then
  echo "Composer not found. Install PHP 8.2+ and Composer first:"
  echo "  brew install php composer"
  exit 1
fi

composer install --no-interaction

if [ ! -f .env ]; then
  cp .env.example .env
  php artisan key:generate
fi

php artisan migrate --force
php artisan db:seed --force
php artisan storage:link 2>/dev/null || true

echo "Backend ready. Run: cd backend && php artisan serve"

# Frontend
echo "Setting up frontend..."
cd ../frontend

npm install

if [ ! -f .env ]; then
  cp .env.example .env
fi

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Start backend:  cd backend && php artisan serve"
echo "Start frontend: cd frontend && npm run dev"
echo ""
echo "Admin login: admin@aurelius.com / password"
echo "Site:        http://localhost:5173"
echo "API:         http://localhost:8000/api"
