# Backend Dockerfile - Cloud Run
FROM node:18-alpine

WORKDIR /app

# Copy package files from backend directory
COPY backend/package*.json ./

# Install dependencies
RUN npm install --production

# Copy backend code
COPY backend/ ./

# Expose port (Cloud Run uses PORT environment variable)
EXPOSE 8080

# Start server - Cloud Run sets PORT environment variable
CMD ["npm", "start"]
