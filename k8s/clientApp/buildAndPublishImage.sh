#!/usr/bin/env bash

echo "going to build image "

this_folder=$(dirname $(readlink -f $0))

. $this_folder/ENV.inc

_pwd=`pwd`

cd $this_folder

docker rmi $IMAGE:$IMAGE_VERSION
docker build -t $IMAGE:$IMAGE_VERSION .
docker tag $IMAGE $DOCKER_HUB_IMG
docker push $DOCKER_HUB_IMG

cd $_pwd

echo "... done."