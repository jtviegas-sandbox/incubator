#!/bin/sh

CONTAINER=consulmain
IMAGE=consulmain_img
DOCKERFILE=consulmain_Dockerfile
TAG=latest

docker stop $CONTAINER && docker rm $CONTAINER
sleep 8

docker build -f $DOCKERFILE -t $IMAGE .
docker run -d --name $CONTAINER $IMAGE:$TAG
#docker run -it --name $CONTAINER $IMAGE:$TAG bash

#sleep 12
#docker exec -it $CONTAINER bash

