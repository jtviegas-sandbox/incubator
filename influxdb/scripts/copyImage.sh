#!/bin/sh

echo "going to build image "

scripts_folder=$(dirname $(readlink -f $0))
base_folder=$(dirname $scripts_folder)

. $scripts_folder/VARS.sh

echo "going to copy image $IMAGE to docker hub and bluemix repository..."

docker pull $IMAGE
#IMAGE_ID=`docker images | grep -E "^$IMAGE.*$IMAGE_VERSION" | awk -e '{print $3}'`
#echo "...image id: $IMAGE_ID"

docker tag $IMAGE $DOCKER_HUB_IMG
docker tag $IMAGE $BLUEMIX_IMG
docker push $DOCKER_HUB_IMG
#cf ic rmi $BLUEMIX_IMG
#docker push $BLUEMIX_IMG

echo "... done."