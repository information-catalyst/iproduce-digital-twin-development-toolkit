#!/bin/bash



docker kill bdwpde >/dev/null 2>&1
docker rm bdwpde >/dev/null 2>&1

DOCKER_CMD="docker run"

# Choose one:
#DOCKER_CMD="$DOCKER_CMD -it --rm"
DOCKER_CMD="$DOCKER_CMD -d"

DOCKER_CMD="$DOCKER_CMD --name bdwpde"
DOCKER_CMD="$DOCKER_CMD -p 7069:80"

DOCKER_CMD="$DOCKER_CMD --restart=unless-stopped"


DOCKER_CMD="$DOCKER_CMD informationcatalyst/bdwpde"



echo
echo "Running docker with default settings: $DOCKER_CMD"
echo

$DOCKER_CMD

echo
echo "docker exited with status: $?"
echo
