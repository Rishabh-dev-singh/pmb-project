# Node.js base image
FROM node:20

# Server ke andar folder
WORKDIR /app

# Package files copy karna
COPY package*.json ./
RUN npm install

# Saara code copy karna
COPY . .

# Frontend start karna (Vite ke liye)
CMD ["npm", "run", "dev", "--", "--host"]