#@IgnoreInspection BashAddShebang
NETWORK=kaki
IMAGE=kaki-producer
IMAGE_VERSION=latest

CONTAINER=producer
HOST=$CONTAINER

PORT=3000
BLUEMIX_IP=169.44.115.43

ZK_HOST=zookeeper
ZK_CONTAINER=zookeeper

KF_HOST=kafka
KF_CONTAINER=kafka

BLUEMIX_CONTAINER_MEMORY=256
REGISTRY=registry.ng.bluemix.net/mynodeappbue
BLUEMIX_IMG=$REGISTRY/$IMAGE