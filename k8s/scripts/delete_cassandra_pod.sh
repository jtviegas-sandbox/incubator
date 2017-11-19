#!/bin/bash

_POD=cassandra-0
if [ $1 ]; then
	_POD=cassandra-$1
fi

echo ">>> deleting pod $_POD..."

kubectl delete pod $_POD

echo ">>> ... done."

echo ">>> running: kubectl get services,pods,deployments,sts -o wide --show-labels"
kubectl get services,pods,deployments,sts -o wide --show-labels

echo ">>> ... done."