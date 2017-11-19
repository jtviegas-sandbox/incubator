#!/bin/bash

echo ">>> creating Google Container Engine (GKE) cluster..."

scripts_folder=$(dirname $(readlink -f $0))

. $scripts_folder/ENV.inc

#--cluster-version=$CLUSTER_VERSION \
gcloud container clusters create $CLUSTER --async \
--image-type=$IMAGE_TYPE --node-labels=app=$APP_LABEL \
--num-nodes=$NUM_NODES --password=$PASSWORD --username=$USERNAME \
--scopes=$SCOPES --zone=$ZONE

echo ">>> ... done."

echo ">>> running: gcloud container clusters list"
gcloud container clusters list
