# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the remaining application files to the working directory
COPY . .

# Expose the port that the application will listen on
EXPOSE 3000

# Define the command to start the application
CMD [ "node", "index.js" ]
