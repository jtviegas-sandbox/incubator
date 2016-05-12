#!/bin/sh

IMAGE=consulservice_img
CONTAINER=consulservice
DOCKERFILE=consulservice_Dockerfile
TAG=latest
CONSUL_NODE=consulserver

docker stop $CONTAINER && docker rm $CONTAINER && sleep 8

docker build -f $DOCKERFILE -t $IMAGE .
CONSUL_IP=`docker inspect --format '{{ .NetworkSettings.IPAddress }}' ${CONSUL_NODE}`
docker run -d --dns $CONSUL_IP -p 8080:8080 --name $CONTAINER $IMAGE:$TAG
