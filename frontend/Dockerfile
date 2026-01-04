FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# =========================
# Runtime
# =========================
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

# Server standalone
COPY --from=builder /app/.next/standalone ./

# Assets estáticos (OBRIGATÓRIO)
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
