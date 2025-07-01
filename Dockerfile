# Use official Node.js LTS image
FROM node:22

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Build app
RUN npm run build

# Expose port
EXPOSE 5001

# Start the app
CMD ["npm", "run", "start:prod"]
