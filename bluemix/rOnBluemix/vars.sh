#!/bin/sh
export DEPLOY_DIR=/app
export VENDOR_DIR=$DEPLOY_DIR/vendor
export JAVA_HOME=$DEPLOY_DIR/java
export R_HOME=$VENDOR_DIR/R/lib64/R
export GCC_HOME=$VENDOR_DIR/gcc

export TASKS_DIR=tasks
export CRAN_MIRROR="http://ftp.heanet.ie/mirrors/cran.r-project.org"
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/lib:/usr/lib:$VENDOR_DIR/addlibs:$JAVA_HOME/jre/lib/amd64/default
export PATH=$PATH:$JAVA_HOME/bin:$GCC_HOME/bin

export MONGO_USER=`echo "$VCAP_SERVICES" | sed 's/.*mongodb:\/\/\(.*\):.*@.*/\1/'`
export MONGO_PASS=`echo "$VCAP_SERVICES" | sed 's/.*mongodb:\/\/.*:\(.*\)@.*/\1/'`
export MONGO_HOST=`echo "$VCAP_SERVICES" | sed 's/.*mongodb:\/\/.*:.*@\(.*\):[0-9]*\/.*/\1/'`
export MONGO_PORT=`echo "$VCAP_SERVICES" | sed 's/.*mongodb:\/\/.*:.*@.*:\([0-9]*\).*\/.*/\1/'`
export MONGO_DBNAME=`echo "$VCAP_SERVICES" | sed 's/.*mongodb:\/\/.*:.*@.*:[0-9]*\/\(.*\)".*/\1/'`