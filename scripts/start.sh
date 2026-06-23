#!/bin/bash

# ECO Smart Backend - Start Script
# This script starts the PHP development server

set -e

echo "=========================================="
echo "ECO Smart Backend - Start Script"
echo "=========================================="
echo ""

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "ERROR: .env file not found"
    echo "Run ./scripts/setup.sh first"
    exit 1
fi

# Check if port is in use
PORT=${APP_URL##*:}
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "ERROR: Port $PORT is already in use"
    echo "Please stop the process using this port or change APP_URL in .env"
    exit 1
fi

# Create logs directory if it doesn't exist
mkdir -p logs

echo "Starting ECO Smart Backend..."
echo "URL: $APP_URL"
echo "Environment: $APP_ENV"
echo ""

# Start PHP built-in server
php -S ${APP_URL##*:} -t .

# Note: The script will continue running until the server is stopped with Ctrl+C
