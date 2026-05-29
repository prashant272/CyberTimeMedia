#!/bin/bash

# Container aur image ka naam define karein
CONTAINER_NAME="timecyber-backend"
IMAGE_NAME="timecyber-backend-image"
PORT="5000"

echo "Stopping old container..."
docker stop $CONTAINER_NAME || true

echo "Removing old container..."
docker rm $CONTAINER_NAME || true

echo "Building new image..."
docker build -t $IMAGE_NAME ./backend

echo "Starting new container..."
docker run -d \
  --name $CONTAINER_NAME \
  -p $PORT:$PORT \
  --env-file ./backend/.env \
  --restart unless-stopped \
  $IMAGE_NAME

echo "Deployment successful! Container is running on port $PORT."
