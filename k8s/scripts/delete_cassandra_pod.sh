#!/bin/bash

echo "£££ delete pod cassandra-0..."

kubectl delete pod cassandra-0

echo "£££ ... done."

echo "running: kubectl get services,pods,deployments,sts -o wide --show-labels"
kubectl get services,pods,deployments,sts -o wide --show-labels