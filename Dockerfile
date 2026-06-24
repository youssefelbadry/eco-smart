FROM php:8.2-apache

# Set document root to public folder
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
ENV PORT 80

RUN apt-get update && apt-get install -y libzip-dev unzip git zip libonig-dev \
    && docker-php-ext-install pdo pdo_mysql \
    && a2enmod rewrite

# Disable conflicting MPM modules to prevent "More than one MPM loaded" error
RUN a2dismod mpm_worker mpm_event || true \
    && a2enmod mpm_prefork

# Adjust Apache config to use new document root
RUN sed -ri -e "s!/var/www/html!${APACHE_DOCUMENT_ROOT}!g" /etc/apache2/sites-available/*.conf \
    && sed -ri -e "s!/var/www/html!${APACHE_DOCUMENT_ROOT}!g" /etc/apache2/apache2.conf \
    && sed -ri -e 's!AllowOverride None!AllowOverride All!g' /etc/apache2/apache2.conf /etc/apache2/sites-available/*.conf \
    && sed -ri -e 's!Listen 80!Listen ${PORT}!g' /etc/apache2/ports.conf

# Copy app
COPY . /var/www/html/

# Copy startup script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set permissions
RUN chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["apache2-foreground"]
