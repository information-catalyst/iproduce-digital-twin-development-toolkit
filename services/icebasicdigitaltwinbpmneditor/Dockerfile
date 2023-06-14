# FROM nginx
# COPY ./dist /indexfiles/
# COPY ./site.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

# Stage 1: Build Angular application
FROM node:14 as builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve Angular application with Nginx
FROM nginx:latest

# Remove default Nginx website
# RUN rm -rf /usr/share/nginx/html/*

# Copy the built Angular app from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
# COPY nginx-custom.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]