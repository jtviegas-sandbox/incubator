#!/bin/sh

scripts_folder=$(dirname $(readlink -f $0))
base_folder=$(dirname $scripts_folder)

. $scripts_folder/VARS.sh

docker stop $CONTAINER
docker rm $CONTAINER

docker run -d -h $HOST --name $CONTAINER -p $PORT:$PORT -v $VOLUME:/var/lib/influxdb $DOCKER_HUB_IMG
#docker logs -f $CONTAINER
