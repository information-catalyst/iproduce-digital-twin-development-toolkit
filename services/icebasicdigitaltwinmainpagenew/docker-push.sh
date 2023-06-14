#!/bin/bash

. common.sh

echo "Preparing to push image $IMAGE_NAME to Docker Hub..."

docker push $IMAGE_NAME

