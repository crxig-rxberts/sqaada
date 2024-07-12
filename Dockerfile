# Build stage
FROM node:20 AS build

WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if it exists)
COPY package*.json ./

# Install dependencies
RUN if [ -f package-lock.json ]; then npm ci; else npm i; fi

# Copy and install client dependencies
COPY client/package*.json client/
RUN cd client && (if [ -f package-lock.json ]; then npm ci; else npm i; fi)

# Copy the rest of the application code
COPY . .

# Build the client
RUN cd client && npm run build

# Production stage
FROM node:20-slim

WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if it exists)
COPY --from=build /usr/src/app/package*.json ./

# Install production dependencies
RUN if [ -f package-lock.json ]; then npm ci --only=production; else npm i --only=production; fi

# Copy built client and server files
COPY --from=build /usr/src/app/client/build client/build
COPY --from=build /usr/src/app/server server

RUN apt-get update && apt-get install -y curl && apt-get clean
COPY start.sh .
RUN chmod +x start.sh

EXPOSE 8080

CMD ["./start.sh"]