# Benares
Discord bot

# Установка
1. Создать бота [на офф сайте](https://discord.com/developers/applications)
2. Выдать ему "Privileged Gateway Intents"
   1. MESSAGE CONTENT INTENT
   2. SERVER MEMBERS INTENT
3. Скопировать папку assets в корень проекта ИЛИ указать пути в config.js
   1. assets/emoji - не увверен, что используется
   2. assets/icons - не увверен, что используется
   3. assets/server_icons - "Update server icon" функционал закоментирован
   4. assets/stickers
4. Создать файлы на основе *.example
   1. .env.example -> .env
   2. db.json.example -> db.json
5. Установить зависимости `npm i`
6. Запустить `npm start` (лог пишется в npm_start.log)