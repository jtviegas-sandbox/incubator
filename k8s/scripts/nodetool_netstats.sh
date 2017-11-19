#!/bin/bash
echo ">>> running 'nodetool netstats' on all nodes..."

kubectl exec cassandra-0 nodetool netstats
kubectl exec cassandra-1 nodetool netstats
kubectl exec cassandra-2 nodetool netstats
kubectl exec cassandra-3 nodetool netstats
kubectl exec cassandra-4 nodetool netstats

echo ">>> ... done."