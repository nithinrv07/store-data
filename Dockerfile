# Multi-stage build for backend
FROM node:18-alpine AS builder

WORKDIR /app

# Copy backend files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production

FROM node:18-alpine

WORKDIR /app

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Copy backend source
COPY backend/ ./

# Expose port
EXPOSE 8080

# Start server
CMD ["node", "server.js"]

