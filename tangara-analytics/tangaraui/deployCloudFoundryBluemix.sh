APP_NAME=tangara
cf delete --f --r $APP_NAME
sleep 16
cf push --no-start
sleep 8
#cf set-env $APP_NAME CONTEXT bluemix
cf start $APP_NAME
sleep 8
# if you want to associate a service
#cf bind-service $APP_NAME $MONGO_SRV
#cf restage $APP_NAME
# or you can add the services in manifest.yml:
#---
#  ...
#  services:
#   - instance_ABC

sleep 16 
cf logs $APP_NAME --recent