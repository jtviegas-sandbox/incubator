#!/bin/bash


if [ -z $1 ]; then
	echo ">>> must provide the node id !!! leaving"
	exit
fi
_NODE=$1

echo ">>> removing dead node $_NODE"

kubectl exec cassandra-0 nodetool removenode $_NODE

echo ">>> ... done."
