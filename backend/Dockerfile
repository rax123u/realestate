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

# Create the public storage symlink so uploaded images are browser-accessible
RUN php artisan storage:link

# Configure PHP upload limits
RUN echo "upload_max_filesize = 25M\npost_max_size = 25M\nmemory_limit = 256M" > /usr/local/etc/php/conf.d/uploads.ini

# Expose Railway port
EXPOSE 8080

# Start Laravel (running migrations and retroactively compressing existing images first)
CMD php artisan migrate --force && php artisan images:compress && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}