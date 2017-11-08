#!/bin/bash

scripts_folder=$(dirname $(readlink -f $0))

. $scripts_folder/ENV.inc

kubectl run cass-serv --image=cassandra:3 --replicas=3 --port=7000 --labels="v=0.0.1,env=test,app=cassandra"
kubectl expose  --type=NodePort deployment cass-serv

