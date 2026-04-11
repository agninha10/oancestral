FROM node:20-alpine

# Needed for bcrypt and Prisma native binaries
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copy package files + prisma schema (postinstall runs prisma generate)
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

# Copy remaining source files
COPY . .

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# Fix file watching on WSL2 / Windows host
ENV WATCHPACK_POLLING=true

CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npm run dev"]
