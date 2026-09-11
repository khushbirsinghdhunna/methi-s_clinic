FROM node:20-bullseye-slim

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files
COPY . .

# Build the frontend and backend
RUN npm run build

# Expose the port
EXPOSE 3008

# Start the server in production mode
ENV NODE_ENV=production
CMD ["npm", "start"]
