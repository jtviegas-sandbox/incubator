APP_NAME=tangara

rm -rf node_modules

cf delete $APP_NAME
cf push -b sdk-for-nodejs
sleep 16 
cf logs $APP_NAME --recent
