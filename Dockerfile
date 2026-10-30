FROM node:20-slim
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npx prisma generate && npm run build
# Beta: jadvallar sxemadan avtomatik yaratiladi
CMD ["sh", "-c", "npx prisma db push --skip-generate && node dist/index.js"]
