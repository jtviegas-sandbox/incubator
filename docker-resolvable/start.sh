#!/bin/sh

APP_IMG=app_img
APP_CONTAINER=app
APP2_CONTAINER=app2
APP_DOCKERFILE=app/Dockerfile
TAG=latest

RESOLVABLE_IMG=mgood/resolvable
RESOLVABLE_CONTAINER=resolvable

docker run -d --hostname $RESOLVABLE_CONTAINER  --name $RESOLVABLE_CONTAINER -v /var/run/docker.sock:/tmp/docker.sock -v /etc/resolv.conf:/tmp/resolv.conf $RESOLVABLE_IMG
sleep 6

docker build -f $APP_DOCKERFILE -t $APP_IMG .
RESOLVABLE_IP=`docker inspect --format '{{ .NetworkSettings.IPAddress }}' ${RESOLVABLE_CONTAINER}`
BRIDGE_IP=`ifconfig docker0 | awk '/inet addr/{print substr($2,6)}'`

docker run -d --hostname $APP_CONTAINER --dns $RESOLVABLE_IP -p 53001:8080 --name $APP_CONTAINER $APP_IMG:$TAG
docker run -d --hostname $APP2_CONTAINER --dns $RESOLVABLE_IP -p 53002:8080 --name $APP2_CONTAINER $APP_IMG:$TAG
