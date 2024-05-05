# Use the official Node.js image as the base image
FROM node:21

# Set the working directory in the container
WORKDIR /app

# Copy the entire monorepo
COPY ../../ ./

# Install dependencies at the root
RUN npm install

# Navigate to the specific service directory
WORKDIR /app/services/inventory

# Expose the port on which the application will run
EXPOSE 3001

# Run the command to start the application
CMD ["npm", "run", "dev"]