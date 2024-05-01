pathToProject="C:/discord_bots/Benares"

docker build . -t persivan/node-benares --no-cache

docker run -v "$pathToProject/assets:/usr/src/app/assets" \
           -v "$pathToProject/db.json:/usr/src/app/db.json" \
           --env-file .env \
           persivan/node-benares