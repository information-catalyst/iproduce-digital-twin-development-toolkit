#!/usr/bin/env bash


docker run -p 80:80 -d  -v "c:\Users\chris\localdock2\democluster\web3d-kafka\public-html":/3DModelMaster --name kafkaweb3d informationcatalyst/kafkaweb3d
# docker run -p 80:80 -it  --name kafkaweb3d informationcatalyst/kafkaweb3d
