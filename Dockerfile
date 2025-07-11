# Use Node.js official image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Expose port (Cloud Run uses PORT environment variable)
EXPOSE 8080

# Start the app on the port Cloud Run expects
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "8080"] 