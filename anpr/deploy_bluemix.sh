#!/bin/sh

#got ip previously with
#_ip=`ice ip request`
#IP=129.41.227.180
PORT=8080
IP=129.41.227.179
CONTAINER_NAME=anpr

ice stop $CONTAINER_NAME
sleep 8
ice rm $CONTAINER_NAME
sleep 8
#ice rmi registry-ice.ng.bluemix.net/techdays/anpr:latest
#ice --local pull registry-ice.ng.bluemix.net/ibmnode

#ice --local build -t anpr .
#ice --local tag anpr registry-ice.ng.bluemix.net/techdays/anpr
ice --local push registry-ice.ng.bluemix.net/techdays/anpr

#ice run --name anpr registry-ice.ng.bluemix.net/techdays/anpr:latest /bin/bash
ice run --name $CONTAINER_NAME -p $PORT registry-ice.ng.bluemix.net/techdays/anpr:latest
#IP=`ice ip request`
#echo "got ip $IP"
ice ip bind $IP $CONTAINER_NAME
