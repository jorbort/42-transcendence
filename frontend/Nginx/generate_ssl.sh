#!/bin/sh

SSL_DIR="/etc/nginx/ssl"
CERT_FILE="$SSL_DIR/localhost.crt"
KEY_FILE="$SSL_DIR/localhost.key"



# Create the SSL directory if it doesn't exist
mkdir -p $SSL_DIR

# Generate self-signed SSL certificate if it doesn't exist
if [ ! -f $CERT_FILE ] || [ ! -f $KEY_FILE ]; then
    echo "Generating self-signed SSL certificate..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout $KEY_FILE -out $CERT_FILE -subj "/CN=localhost"
else
    echo "SSL certificate already exists."
fi

# Start Nginx
nginx -g "daemon off;"