#!/bin/bash

scripts_folder=$(dirname $(readlink -f $0))

. $scripts_folder/ENV.inc

_pod=$(kubectl get pods -l app=cassandra -o jsonpath='{.items[0].metadata.name}')
kubectl port-forward $_pod 48858:7000

