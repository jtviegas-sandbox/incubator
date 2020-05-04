#!/bin/sh

CONTAINER_NAME=anpr
PORT=8080

ice --local stop anpr
sleep 8
ice --local rm anpr
sleep 8

ice --local pull registry-ice.ng.bluemix.net/ibmnode

ice --local build -t anpr .
#ice --local tag anpr registry-ice.ng.bluemix.net/techdays/anpr

ice --local run -d -p $PORT:$PORT anpr
#ice --local run -i -t --entrypoint /bin/bash -p 8080:8080 anpr
