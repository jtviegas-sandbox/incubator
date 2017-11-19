#!/bin/bash

echo ">>> connection to cluster ..."

scripts_folder=$(dirname $(readlink -f $0))

. $scripts_folder/ENV.inc

gcloud container clusters get-credentials $CLUSTER --zone $ZONE \
--project $GKE_PROJECT

echo ">>> ... done."