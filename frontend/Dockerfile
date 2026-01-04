# ===== BUILD =====
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ===== RUNTIME =====
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

# Copia o server standalone
COPY --from=builder /app/.next/standalone ./

# Copia os arquivos estáticos (ESSENCIAL)
COPY --from=builder /app/.next/static ./.next/static

# Se usar public/
COPY --from=builder /app/public ./public

EXPOSE 3000

# ⚠️ COMANDO CORRETO PARA STANDALONE
CMD ["node", "server.js"]
