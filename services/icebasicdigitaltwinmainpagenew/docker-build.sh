#!/bin/bash

. common.sh

MVN_OP=
DOCKER_BUILD_OP=

echo "Preparing to build image $IMAGE_NAME..."

# Tests are run by default
if [ "$TESTS" = false ] ; then
    MVN_OP=-DskipTests
fi

# No cache option sometimes gets ride of some silly errors from docker,
# but it slows down the building process.
if [ "$DOCKER_CACHE" = true ] ; then
    DOCKER_BUILD_OP=--no-cache
fi

docker build $DOCKER_BUILD_OP -t $IMAGE_NAME .

#docker tag $IMAGE_NAME crowdhealthtasks.ds.unipi.gr:4567/crowdhealth/dataconverter
echo "Image built successfully. Run with './docker-run.sh'."
