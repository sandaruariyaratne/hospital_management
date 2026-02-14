# Frontend Dockerfile
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy frontend code
COPY . .

# Expose frontend port
EXPOSE 5173

# Start Vite dev server
# Use --host to make it accessible outside container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]