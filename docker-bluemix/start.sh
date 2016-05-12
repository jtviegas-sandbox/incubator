#!/bin/sh

. ./VARS.sh

APP_NAME=app
APP_IMG=$REGISTRY/$APP_NAME
APP2_NAME=app2
APP2_IMG=$REGISTRY/$APP2_NAME

docker build -f $APP_DOCKERFILE -t $APP_IMG .
docker build -f $APP_DOCKERFILE -t $APP2_IMG .

docker push $APP_IMG
docker push $APP2_IMG

cf ic run --name $APP2_NAME -p $PORT -m $BLUEMIX_CONTAINER_MEMORY $APP2_IMG
cf ic run --name $APP_NAME  --link $APP2_NAME:$APP2_NAME -p $PORT -m $BLUEMIX_CONTAINER_MEMORY $APP_IMG

sleep 12
cf ic ip bind $IP1 $APP_NAME
cf ic ip bind $IP2 $APP2_NAME
