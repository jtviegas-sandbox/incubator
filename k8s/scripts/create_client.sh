#!/bin/bash

echo ">>> creating cassandra client app..."
scripts_folder=$(dirname $(readlink -f $0))
base_folder=$(dirname $scripts_folder)
config_folder=$base_folder/config

. $scripts_folder/ENV.inc

kubectl create -f $config_folder/cassandra_client.yaml

echo ">>> ... done."

echo ">>> running: kubectl get services,pods,deployments,sts -o wide --show-labels"
kubectl get services,pods,deployments,sts -o wide --show-labels

echo ">>> ... done."