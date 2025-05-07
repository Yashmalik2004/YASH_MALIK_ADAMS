# Use official Node.js v18 image
FROM node:18

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first for layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy entire project folder content into container
COPY . .

# Expose port 8080 for Cloud Run
EXPOSE 8080

# Start the server using npm start (as defined in your package.json)
CMD ["npm", "start"]
