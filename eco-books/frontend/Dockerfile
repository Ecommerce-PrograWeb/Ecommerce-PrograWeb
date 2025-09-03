FROM node:22

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Build the app
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

EXPOSE 3000

# Start the app
CMD ["npm", "start"]