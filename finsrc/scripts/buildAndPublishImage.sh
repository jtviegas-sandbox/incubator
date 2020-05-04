#!/usr/bin/env bash

echo "going to build image "

scripts_folder=$(dirname $(readlink -f $0))
base_folder=$(dirname $scripts_folder)


. $scripts_folder/ENV.inc

_pwd=`pwd`

cd $base_folder

docker rmi $IMAGE:$IMAGE_VERSION
docker build -t $IMAGE:$IMAGE_VERSION .
docker tag $IMAGE $DOCKER_HUB_IMG
docker push $DOCKER_HUB_IMG

cd $_pwd

echo "... done."