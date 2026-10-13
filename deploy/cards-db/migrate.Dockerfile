# Tiny image whose only job is `prisma migrate deploy` for the cards DB. Built from the repo
# root (see .dockerignore) so it carries exactly the committed prisma/migrations.
FROM node:22-alpine
RUN apk add --no-cache openssl
WORKDIR /app
# Versions mirror package.json; bump together.
RUN npm init -y >/dev/null && npm i --no-audit --no-fund prisma@7.10.0 dotenv@18
COPY prisma.config.ts ./
COPY prisma ./prisma
CMD ["npx", "prisma", "migrate", "deploy"]
