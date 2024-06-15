# Use a lightweight Node.js base image 
FROM node:18-alpine AS builder 
# Set the working directory
WORKDIR /app 

# Copy package.json and package-lock.json (or yarn.lock) 
COPY package*.json ./

# Install dependencies (adjust if you use yarn) 
RUN npm install 

COPY . .

# Build the React app (adjust the command if you use a different script) 
RUN npm run build  
# Assuming your build script is "npm run build"

# Expose the port where the React app will run (usually 3000) 
EXPOSE 3000 
# Start the React app (adjust the command if you use a different script) 
CMD [ "npm", "start" ]