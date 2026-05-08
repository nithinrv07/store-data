# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Copy a custom nginx config if needed, or just use default
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
