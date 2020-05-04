#!/bin/sh
. ./VARS.sh
docker run -d --name $CONTAINER -p 8080:8080 --add-host $MONGO_CONTAINER_ALIAS:$MONGO_IP --env MONGO_DB=$MONGO_DB $IMG
#docker run -it --name $CONTAINER -p 8080:8080 --add-host $MONGO_CONTAINER_ALIAS:$MONGO_IP --env MONGO_DB=$MONGO_DB $IMG /bin/sh
