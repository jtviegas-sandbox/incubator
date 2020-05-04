#!/bin/sh

WORKSPACE=/home/joaovieg/workspace/eclipse/dev
BASE_DIR=$WORKSPACE/bluemix/xperiment
DIR_RESTLAYER=$WORKSPACE/labs/restlayer
DIR_SOCIALTOUR=$WORKSPACE/labs/socialtour

#---build dependency projects

#rm -rf $BASE_DIR/config/*
rm -rf $BASE_DIR/src/main/java/*
#rm -rf $BASE_DIR/src/main/webapp/*

#cp $DIR_RESTLAYER/config/wlp/web.xml $BASE_DIR/config/
cp -r $DIR_RESTLAYER/src/main/java/* $BASE_DIR/src/main/java/
rm -rf $BASE_DIR/src/main/java/org/aprestos/labs/ee/ws/restlayer/twitter
#cp -r $DIR_RESTLAYER/src/main/webapp/* $BASE_DIR/src/main/webapp/
#cp -r $DIR_SOCIALTOUR/src/main/webapp/css $BASE_DIR/src/main/webapp/
#cp -r $DIR_SOCIALTOUR/src/main/webapp/img $BASE_DIR/src/main/webapp/
#cp -r $DIR_SOCIALTOUR/src/main/webapp/js $BASE_DIR/src/main/webapp/
#cp -r $DIR_SOCIALTOUR/src/main/webapp/index.html $BASE_DIR/src/main/webapp/

mvn clean package
cf push xperiment -p target/xperiment.war