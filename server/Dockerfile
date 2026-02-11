# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies (only production)
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Environment variables should be passed at runtime, but we can set a default port
ENV PORT=5000
EXPOSE 5000

# Use a non-root user for security
USER node

# Start the application
CMD ["npm", "start"]
