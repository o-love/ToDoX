FROM php:8.1.0-fpm-buster

WORKDIR "/application"

# Install selected extensions and other stuff
RUN apt-get update \
    && apt-get -y --no-install-recommends install  php8.0-mysql php-xdebug libmcrypt-dev \
    && apt-get clean; rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/*

# Microsoft SQL Server Extension
# RUN apt-get update -yqq && \
#     apt-get -yqq --no-install-recommends install git zip unzip libzip-dev libmagickwand-dev gnupg libicu-dev && \
#     pecl channel-update pecl.php.net && \
#     yes '' | pecl install imagick && \
#     docker-php-ext-install zip pcntl && \
#     docker-php-ext-enable imagick

# # PHP
RUN apt-get update && apt-get install -y \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libpq-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd \
    && docker-php-ext-install pdo pdo_pgsql \
    && docker-php-ext-install pdo_mysql

# ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/

# RUN chmod +x /usr/local/bin/install-php-extensions && \
#     install-php-extensions intl opcache apcu xdebug ssh2

# # WORKDIR /usr/src/app

# # Composer
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

# # Yarn
# RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - && apt-get -y install nodejs
# RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
#     echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
#     apt-get update && apt-get -yqq install yarn

# COPY conf.d/docker-php.ini /usr/local/etc/php/conf.d/docker-php.ini

# USER $LOCAL_USER