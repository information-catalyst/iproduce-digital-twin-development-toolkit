#!/usr/bin/env bash


docker stop kafkajavatest || true && docker rm kafkajavatest || true

docker build -t informationcatalyst/kafkajavatest .
docker run --name kafkajavatest --rm  --net="kafkanetwork_default" informationcatalyst/kafkajavatest 

