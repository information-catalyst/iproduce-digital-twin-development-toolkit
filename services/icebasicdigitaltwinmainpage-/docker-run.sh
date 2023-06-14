#!/bin/bash

. common.sh

docker kill $CONTAINER_NAME >/dev/null 2>&1
docker rm $CONTAINER_NAME >/dev/null 2>&1

DOCKER_CMD="docker run"

# Choose one:
#DOCKER_CMD="$DOCKER_CMD -it --rm"
DOCKER_CMD="$DOCKER_CMD -d"

DOCKER_CMD="$DOCKER_CMD --name $CONTAINER_NAME"
DOCKER_CMD="$DOCKER_CMD -p $EXT_PORT:80"
if [ "$DEBUG" = true ] ; then
    DOCKER_CMD="$DOCKER_CMD -p $DEBUG_PORT:5005"
fi
DOCKER_CMD="$DOCKER_CMD --restart=unless-stopped"

#cpo debug load web content fromllocal volume for faster updates
#DOCKER_CMD="$DOCKER_CMD -v "c:\\Users\\chris\\localdock2\\democluster\\SmartFactoryConsole\\webcontent":/var/www"

DOCKER_CMD="$DOCKER_CMD $IMAGE_NAME"



echo
echo "Running docker with default settings: $DOCKER_CMD"
echo

$DOCKER_CMD

echo
echo "docker exited with status: $?"
echo
