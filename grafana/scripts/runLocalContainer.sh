#!/bin/sh

scripts_folder=$(dirname $(readlink -f $0))
base_folder=$(dirname $scripts_folder)

. $scripts_folder/ENV.inc

docker stop $CONTAINER
docker rm $CONTAINER

ENV="-e GF_SECURITY_ADMIN_PASSWORD=password -e GF_SECURITY_ADMIN_USER=root"
docker run -d -h $HOST --name $CONTAINER --link $DB_CONTAINER:$DB_CONTAINER -p $PORT:$PORT $ENV $DOCKER_HUB_IMG
docker logs -f $CONTAINER
