# 1. Use an official Node.js runtime as a parent image
FROM node:18-alpine

# 2. Set the working directory in the container
WORKDIR /app

# 3. Copy package.json and package-lock.json
COPY package*.json ./

# 4. Install only production dependencies
RUN npm install --production

# 5. Copy the rest of your app's source code
COPY . .

# 6. Your app runs on port 3000, so expose it
EXPOSE 3000

# 7. Define the command to run your app
CMD [ "npm", "start" ]