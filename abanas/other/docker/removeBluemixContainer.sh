#!/bin/sh
. ./VARS.sh
cf ic stop $CONTAINER
sleep 15
cf ic rm -f $CONTAINER
