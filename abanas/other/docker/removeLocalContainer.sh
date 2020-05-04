#!/bin/sh
. ./VARS.sh
docker stop $CONTAINER
sleep 15
docker rm -f $CONTAINER