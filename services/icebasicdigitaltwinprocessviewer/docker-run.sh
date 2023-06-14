#!/bin/bash

docker stop kafkaprocessviewer || true && docker rm kafkaprocessviewer || true


docker run -d  -p 7049:80 --name kafkaprocessviewer informationcatalyst/fakepde
