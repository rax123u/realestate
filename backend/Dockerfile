FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    unzip \
    zip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    && docker-php-ext-install \
        pdo_mysql \
        mbstring \
        bcmath \
        exif \
        pcntl \
        gd \
        zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy application
COPY . .

# Install PHP dependencies
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction

# Ensure storage permissions
RUN mkdir -p storage bootstrap/cache && \
    chmod -R 775 storage bootstrap/cache

# Expose Railway port
EXPOSE 8080

# Start Laravel
CMD php artisan serve --host=0.0.0.0 --port=${PORT:-8080}