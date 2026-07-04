FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    default-mysql-client \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy composer files first for better layer caching
COPY composer.json composer.lock ./
RUN composer install --optimize-autoloader --no-dev --no-scripts --no-interaction

# Copy the rest of the application
COPY . .

# Generate optimized autoloader and cache config
RUN composer dump-autoload --optimize \
    && php artisan config:clear

# Set permissions for storage and cache
RUN chmod -R 775 storage bootstrap/cache

EXPOSE 8080

CMD php artisan migrate --force && php artisan serve --host 0.0.0.0 --port ${PORT:-8080}