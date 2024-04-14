pathToProject="C:/discord_bots/Benares"

docker build . -t persivan/node-benares --no-cache

docker run -v "$pathToProject/assets:/usr/src/app/assets" \
           -v "$pathToProject/.env:/usr/src/app/.env" \
           -v "$pathToProject/db.json:/usr/src/app/db.json" \
           persivan/node-benares