# Stage 1: Build Stage
FROM node:21 AS build

# Создаем рабочую папку
WORKDIR /usr/src/app

# Копируем файлы package.json и package-lock.json и устанавливаем зависимости
COPY package*.json ./
RUN npm ci

# Копируем все файлы проекта
COPY . .

# Stage 2: Production Stage
FROM node:21-slim

# Создаем рабочую папку
WORKDIR /usr/src/app

# Копируем зависимости из build stage
COPY --from=build /usr/src/app .

# Запуск проекта
CMD [ "npm", "start" ]