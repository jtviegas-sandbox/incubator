#!/bin/bash


kubectl exec cassandra-0 nodetool netstats
kubectl exec cassandra-1 nodetool netstats
kubectl exec cassandra-2 nodetool netstats
