FROM node:20-bullseye-slim AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build         # викликає tsc

FROM node:20-bullseye-slim AS runtime
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev --include=optional   # тут лише prod

COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]
