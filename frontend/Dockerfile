FROM node:22-alpine AS builder

WORKDIR /app

# Instal dependencies
COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN  npm run build

# Production image
FROM node:22-alpine AS prod

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install production dependencies
RUN npm ci --only=production

ENV NODE_ENV=production
EXPOSE 5173

CMD ["npm", "start"]