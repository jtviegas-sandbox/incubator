#!/bin/bash

echo ">>> running: kubectl get services,pods,deployments,sts -o wide --show-labels"
kubectl get services,pods,deployments,sts -o wide --show-labels

echo ">>> ... done."