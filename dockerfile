# Use the official Node.js image.
# https://hub.docker.com/_/node
FROM node:18

# Create and set the working directory.
WORKDIR /usr/src/app

# Copy package.json and yarn.lock files.
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies.
RUN yarn install

# Copy the rest of the application code.
COPY . .

# Expose the application port.
EXPOSE 4000

# Command to run the application.
CMD [ "yarn", "start" ]
