#!/bin/bash

echo "£££ creating cassandra stateful set..."
scripts_folder=$(dirname $(readlink -f $0))
base_folder=$(dirname $scripts_folder)
config_folder=$base_folder/config

. $scripts_folder/ENV.inc

kubectl create -f $config_folder/stateful_set.yaml

echo "£££ ... done."

echo "running: kubectl get services,pods,deployments,sts -o wide --show-labels"
kubectl get services,pods,deployments,sts -o wide --show-labels