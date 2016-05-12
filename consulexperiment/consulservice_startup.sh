#!/bin/sh

CONSUL_BIN=/opt/consul/bin/consul
CONFIG_DIR=/opt/consul/etc
BOOTSTRAP_IP=$1
SERVER_IP=$2
OPTIONS="agent -config-dir=$CONFIG_DIR -join=$BOOTSTRAP_IP -join=$SERVER_IP"

node /opt/service/service.js &

LOCAL_IP=`ifconfig  | grep 'inet addr:'| grep -v '127.0.0.1' | cut -d: -f2 | awk '{ print $1}'`
echo "local IP is $LOCAL_IP"
$CONSUL_BIN $OPTIONS -client=$LOCAL_IP 

~                                                                                                          
~                                                                                                          
~                                                                                                          
~                                        

