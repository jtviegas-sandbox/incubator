#!/bin/sh

devops_folder=$(dirname $(readlink -f $0))
base_folder=$(dirname $devops_folder)

. $devops_folder/VARS.sh
#docker rmi $IMAGE:$IMAGE_VERSION
#docker build -t $IMAGE:$IMAGE_VERSION $base_folder

cf ic rmi $BLUEMIX_IMG
cf ic build -t $BLUEMIX_IMG $base_folder