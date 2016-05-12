#!/bin/sh

CONTAINER_NAME=tangara
REGISTRY=registry-ice.ng.bluemix.net
ORG=techdays


#stop and remove container
#ice stop $CONTAINER_NAME
#sleep 8
#ice rm $CONTAINER_NAME
#sleep 8

#remove image
#ice rmi $REGISTRY/$ORG/$CONTAINER_NAME
#ice pull $REGISTRY/ibmnode
#rebuild and tag image
#ice build -t $CONTAINER_NAME .

#ice --local push $REGISTRY/$ORG/$CONTAINER_NAME

#run container of that image
#ice run --name $CONTAINER_NAME $REGISTRY/$ORG/$CONTAINER_NAME
#ice run --name example registry-ice.ng.bluemix.net/techdays/example
#ice --local run -i -t -P=true  --entrypoint /bin/bash $CONTAINER_NAME

#------------------------------------------------------

ice rmi $REGISTRY/$ORG/$CONTAINER_NAME
ice --local tag --force=true $CONTAINER_NAME:latest $REGISTRY/$ORG/$CONTAINER_NAME:latest
ice --local push $REGISTRY/$ORG/$CONTAINER_NAME:latest
ice -v run --name $CONTAINER_NAME $REGISTRY/$ORG/$CONTAINER_NAME:latest
sleep 8
ice logs $CONTAINER_NAME