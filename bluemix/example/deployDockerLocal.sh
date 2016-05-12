#!/bin/sh

CONTAINER_NAME=bluemixexample
REGISTRY=registry.ng.bluemix.net
ORG=techdays

containerId=`docker ps | grep $CONTAINER_NAME | awk '{print $1;}'`
echo "...container found: $containerId"

if [ ! -z "$containerId" ]; then
	echo "going to stop container $containerId"
    ice --local stop $containerId
 else
 	echo "no container to stop"
fi
sleep 10

ice --local rmi --force=true $CONTAINER_NAME
sleep 10

ice --local pull $REGISTRY/ibmnode:latest
ice --local build -t $CONTAINER_NAME .
#ice --local run -d $CONTAINER_NAME
#ice --local run -i -t -P=true  --entrypoint /bin/bash $CONTAINER_NAME
sleep 16

containerId=`docker ps | grep $CONTAINER_NAME | awk '{print $1;}'`
echo "...container found: $containerId"
if [ ! -z "$containerId" ]; then
    ice --local logs $containerId
fi
