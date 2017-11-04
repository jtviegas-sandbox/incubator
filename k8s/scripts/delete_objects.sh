#!/bin/bash

echo "£££ delete all project related objects from the cluster..."

scripts_folder=$(dirname $(readlink -f $0))

. $scripts_folder/ENV.inc

kubectl delete pods,sts,services,deployments -l app=$APP_LABEL

echo "£££ ... done."

echo "running: kubectl get services,pods,deployments,sts -o wide --show-labels"
kubectl get services,pods,deployments,sts -o wide --show-labels