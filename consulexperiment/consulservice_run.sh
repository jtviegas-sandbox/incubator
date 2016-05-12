#!/bin/sh

if [ -z "$1" ]; then
	echo "must provide the bootstrap server container name! exiting."
	exit 1
fi
if [ -z "$2" ]; then
	echo "must provide the backup server container name! exiting."
	exit 1
fi

BOOTSTRAP_CONTAINER=$1
BOOTSTRAP_IP=`docker inspect --format '{{ .NetworkSettings.IPAddress }}' ${BOOTSTRAP_CONTAINER}`
echo "bootstrap container $BOOTSTRAP_CONTAINER has ip $BOOTSTRAP_IP"

SERVER_CONTAINER=$2
SERVER_IP=`docker inspect --format '{{ .NetworkSettings.IPAddress }}' ${SERVER_CONTAINER}`
echo "backup server container $SERVER_CONTAINER has ip $SERVER_IP"

IMAGE=consulservice_img
CONTAINER=consulservice
DOCKERFILE=consulservice_Dockerfile
TAG=latest

docker stop $CONTAINER && docker rm $CONTAINER
sleep 8

docker build -f $DOCKERFILE -t $IMAGE .
docker run -e "BOOTSTRAP_IP=$BOOTSTRAP_IP" -e "SERVER_IP=$SERVER_IP" -d --name $CONTAINER $IMAGE:$TAG
#docker run -e "BOOTSTRAP_IP=$BOOTSTRAP_IP" -e "SERVER_IP=$SERVER_IP" -it --name $CONTAINER $IMAGE:$TAG bash

#sleep 12
#docker exec -it $CONTAINER bash

