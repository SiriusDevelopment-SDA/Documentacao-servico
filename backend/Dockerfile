FROM node:18-alpine

WORKDIR /app

# Copia dependências
COPY package*.json ./
COPY prisma ./prisma

# Instala dependências
RUN npm install

# Gera Prisma Client
RUN npx prisma generate

# Copia o restante do código
COPY . .

EXPOSE 3001

CMD ["npm", "start"]