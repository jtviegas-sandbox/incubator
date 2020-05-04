#!/bin/sh

scripts_folder=$(dirname $(readlink -f $0))
base_folder=$(dirname $scripts_folder)

. $scripts_folder/ENV.inc

echo "going to copy image $IMAGE to docker hub and bluemix repository..."

docker pull $SOURCE_IMAGE

docker tag $SOURCE_IMAGE $DOCKER_HUB_IMG
docker tag $SOURCE_IMAGE $BLUEMIX_IMG
docker push $DOCKER_HUB_IMG

echo "... done."




