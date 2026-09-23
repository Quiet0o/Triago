FROM php:8.5-fpm-alpine

# Install system dependencies & PHP extension installer
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

RUN apk add --no-cache \
    bash \
    git \
    unzip \
    curl \
    && install-php-extensions \
    intl \
    opcache \
    pdo \
    pdo_pgsql \
    pdo_mysql \
    zip

# Copy Composer binary from official composer image
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

# Copy custom php.ini configuration optimized for Symfony
COPY docker/php.ini $PHP_INI_DIR/conf.d/symfony.ini

WORKDIR /var/www/backend

# Create system user/directories for Symfony cache and logs
RUN mkdir -p var/cache var/log && \
    chmod -R 777 var

EXPOSE 9000

CMD ["php-fpm"]
