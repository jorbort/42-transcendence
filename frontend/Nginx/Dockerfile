# Use the official Nginx image from the Docker Hub
FROM nginx:latest

# Copy custom configuration file from the current directory
# to the Nginx configuration directory
COPY frontend/Nginx/nginx.conf /etc/nginx/nginx.conf

# Copy your website's static files to the appropriate directory
COPY frontend/Nginx/app /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
