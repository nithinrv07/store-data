FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install all dependencies (this runs the postinstall script in root package.json)
RUN npm install

# Copy all source files
COPY . .

# Build the application (runs root build script which builds frontend and moves to dist)
RUN npm run build

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
