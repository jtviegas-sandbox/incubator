#!/bin/bash
echo ">>> running 'nodetool status' on all nodes..."
kubectl exec cassandra-0 nodetool status
kubectl exec cassandra-1 nodetool status
kubectl exec cassandra-2 nodetool status
kubectl exec cassandra-3 nodetool status
kubectl exec cassandra-4 nodetool status
echo ">>> ... done."