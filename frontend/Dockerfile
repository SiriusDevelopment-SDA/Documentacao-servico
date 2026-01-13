FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ————————————————
# Runtime
# ————————————————
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

# Copia standalone gerado pelo build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Porta usada pelo Next standalone
EXPOSE 3000

CMD ["node", "server.js"]
