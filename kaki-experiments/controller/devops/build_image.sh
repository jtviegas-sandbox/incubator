#!/bin/sh

devops_folder=$(dirname $(readlink -f $0))
base_folder=$(dirname $devops_folder)

. $devops_folder/VARS.sh

docker build -t $IMAGE:$IMAGE_VERSION $base_folder