#!/bin/bash


kubectl exec cassandra-0 nodetool status
kubectl exec cassandra-1 nodetool status
kubectl exec cassandra-2 nodetool status