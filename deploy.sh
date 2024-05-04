#!/bin/bash

# Define environment variables. $(pwd -W) - for windows, $(PWD) for unix
DISCORD_BOTS_ASSETS="$(pwd -W)/assets"
DISCORD_BOTS_DB="$(pwd -W)/db.json"
DISCORD_BOTS_LOG="$(pwd -W)/npm_start.log"
DISCORD_TOKEN="N...k"
OPENAI_API_KEY="s...h"
DOCKER_IMAGE="benares"
DOCKER_CONTAINER="benares_container"

# Stop and remove the old container if it exists
if [ "$(docker ps -a -q -f name=$DOCKER_CONTAINER)" ]; then
    docker stop $DOCKER_CONTAINER
    docker rm $DOCKER_CONTAINER
fi

# Remove the old Docker image if it exists
if [ "$(docker images -q $DOCKER_IMAGE)" ]; then
    docker rmi $DOCKER_IMAGE
fi

# Build the Docker image
docker build -t $DOCKER_IMAGE .

# Run a new container with the updated image
docker run -d \
  -v "$DISCORD_BOTS_ASSETS:/usr/src/app/assets" \
  -v "$DISCORD_BOTS_DB:/usr/src/app/db.json" \
  -e "DISCORD_TOKEN=$DISCORD_TOKEN" \
  -e "OPENAI_API_KEY=$OPENAI_API_KEY" \
  --name $DOCKER_CONTAINER \
  $DOCKER_IMAGE