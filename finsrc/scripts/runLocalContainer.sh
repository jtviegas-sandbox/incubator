#!/usr/bin/env bash

scripts_folder=$(dirname $(readlink -f $0))
base_folder=$(dirname $scripts_folder)

. $scripts_folder/ENV.inc

docker stop $CONTAINER
docker rm $CONTAINER

docker run -d -h $HOST --name $CONTAINER --link $ZK_CONTAINER:$ZK_HOST  \
	--link $KAFKA_CONTAINER:$KAFKA_HOST $DOCKER_HUB_IMG:$IMAGE_VERSION

