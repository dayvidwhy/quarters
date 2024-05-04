# Use the official Node.js 12 image as the base image
FROM node:21

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port on which the application will run
EXPOSE 3000

# Run the command to start the application
CMD ["npm", "run", "start"]