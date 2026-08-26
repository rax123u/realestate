FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    git \
    curl \
    unzip \
    zip \
    libpng-dev \
    libjpeg-dev \
    libwebp-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
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


COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app


COPY . .


RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction


RUN mkdir -p storage bootstrap/cache && \
    chmod -R 775 storage bootstrap/cache


RUN php artisan storage:link


RUN echo "upload_max_filesize = 25M\npost_max_size = 25M\nmemory_limit = 256M" > /usr/local/etc/php/conf.d/uploads.ini


EXPOSE 8080


CMD php artisan optimize:clear && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}