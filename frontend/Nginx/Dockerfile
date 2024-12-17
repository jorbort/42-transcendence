# Use the official Nginx image from the Docker Hub
FROM nginx:latest

# Copy custom configuration file from the current directory
# to the Nginx configuration directory

COPY frontend/Nginx/nginx.conf /etc/nginx/nginx.conf

# Copy your website's static files to the appropriate directory
COPY frontend/Nginx/app /usr/share/nginx/html

# Copy the SSL generation script
COPY frontend/Nginx/generate_ssl.sh /usr/local/bin/generate_ssl.sh

# Make the script executable
RUN chmod +x /usr/local/bin/generate_ssl.sh

# Expose ports 80 and 443 to the outside world
EXPOSE 80 443

# Run the SSL generation script and start Nginx
CMD ["/usr/local/bin/generate_ssl.sh"]