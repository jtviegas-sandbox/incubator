#!/bin/sh

devops_folder=$(dirname $(readlink -f $0))
base_folder=$(dirname $devops_folder)

. $devops_folder/VARS.sh

docker stop $CONTAINER
docker rm $CONTAINER

#--link $ZK_CONTAINER:$ZK_HOST --link $KF_CONTAINER:$KF_HOST

docker run -d -h $HOST --name $CONTAINER -P --network=$NETWORK  $IMAGE:$IMAGE_VERSION
docker logs -f $CONTAINER



