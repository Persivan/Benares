FROM node:21

# Создаем рабочую папку
WORKDIR /usr/src/app

# Установка зависимостей
COPY package*.json ./
RUN npm install

# Копирование всего проекта
COPY . .

# Запуск проекта
CMD [ "npm", "start" ]