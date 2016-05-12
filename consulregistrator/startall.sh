#!/bin/sh

BRIDGE_IP=`ifconfig docker0 | awk '/inet addr/{print substr($2,6)}'`

CONSUL_IMG="gliderlabs/consul-server"
CONSUL_NODE=consulserver
REGISTRATOR_IMG="gliderlabs/registrator"
REGISTRATOR_NODE=registrator

docker run -d -p $BRIDGE_IP:8500:8500 -p $BRIDGE_IP:53:8600/udp -p $BRIDGE_IP:8400:8400 --name $CONSUL_NODE $CONSUL_IMG -node=$CONSUL_NODE -bootstrap -client=0.0.0.0 -recursor=8.8.8.8 -recursor=8.8.4.4
#CONSUL_IP=`docker inspect --format '{{ .NetworkSettings.IPAddress }}' ${CONSUL_NODE}`
docker run -d -v /var/run/docker.sock:/tmp/docker.sock --name $REGISTRATOR_NODE $REGISTRATOR_IMG consul://$BRIDGE_IP:8500
