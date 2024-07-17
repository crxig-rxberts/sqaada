# Build stage
FROM node:20 AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN if [ -f package-lock.json ]; then npm ci; else npm i; fi

COPY client/package*.json client/
RUN cd client && (if [ -f package-lock.json ]; then npm ci; else npm i; fi)

COPY . .

RUN cd client && npm run build

# Production stage
FROM node:20-slim

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package*.json ./

RUN if [ -f package-lock.json ]; then npm ci --only=production; else npm i --only=production; fi

COPY --from=build /usr/src/app/client/build client/build
COPY --from=build /usr/src/app/server server

RUN apt-get update && apt-get install -y curl && apt-get clean
COPY start.sh .
RUN chmod +x start.sh

EXPOSE 8080

CMD ["./start.sh"]