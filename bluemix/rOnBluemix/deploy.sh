#!/bin/sh

MONGO_SERVICE=mongolab
MONGO_PLAN=sandbox
MONGO_INSTANCE=mongo
R_APP=ronbluemix

if [ "$1" = "-d" ]; then
	echo "..deleting all..."
	cf delete $R_APP
	cf unbind-service $R_APP $MONGO_INSTANCE
	cf delete-service $MONGO_INSTANCE -f
fi

echo "..creating all..."
cf push $R_APP -b https://github.com/jtviegas/bluemix-R-buildpack.git --no-route
#cf create-service $MONGO_SERVICE $MONGO_PLAN $MONGO_INSTANCE
cf bind-service $R_APP $MONGO_INSTANCE
cf restage $R_APP
echo "...done."
