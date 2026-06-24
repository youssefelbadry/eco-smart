#!/bin/bash
set -e

# Default to port 80 if PORT is not set (local Docker)
PORT=${PORT:-80}

# Update Apache ports.conf with the dynamic port
sed -i "s/Listen 80/Listen ${PORT}/g" /etc/apache2/ports.conf
sed -i "s/Listen \[::]:80/Listen [::]:${PORT}/g" /etc/apache2/ports.conf

# Verify Apache configuration
apache2ctl -t

# Execute Apache in foreground
exec "$@"
