#!/bin/bash

echo ">>> creating cassandra headless service to provide internal dns to cassandra nodes..."
scripts_folder=$(dirname $(readlink -f $0))
base_folder=$(dirname $scripts_folder)
config_folder=$base_folder/config

. $scripts_folder/ENV.inc

kubectl create -f $config_folder/headless_service.yaml

echo ">>> ... done."

echo ">>> running: kubectl get services -o wide --show-labels"
kubectl get services -o wide --show-labels

echo ">>> ... done."