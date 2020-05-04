#!/bin/sh
. ./VARS.sh
cf ic run --name $CONTAINER -p $PORT --link $MONGO_CONTAINER:$MONGO_CONTAINER_ALIAS --env MONGO_DB=$MONGO_DB -m $BX_CONTAINER_MEMORY $BX_IMG
sleep 30
cf ic ip bind $BX_IP $CONTAINER
