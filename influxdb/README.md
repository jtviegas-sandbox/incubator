# influxdb

## influxdb docker container handling scripts

- hostname: influxdb
- exposes ports: 8086

### usage:

- edit VARS.sh accordingly:
  ```
  NAME=influxdb
  VOLUME=/tmp
  CONTAINER=$NAME
  HOST=$CONTAINER
  PORT=8086
  IMAGE=$NAME
  IMAGE_VERSION=latest
  BLUEMIX_CONTAINER_MEMORY=128
  REGISTRY=registry.ng.bluemix.net/mynodeappbue
  BLUEMIX_IMG=$REGISTRY/$IMAGE
  DOCKER_HUB_IMG=kakicode/$NAME
  ```
- scripts/copyImage.sh - push docker image to dockerHub (/kakicode/influxdb) and private bluemix registry (registry.ng.bluemix.net/mynodeappbue/influxdb)
- scripts/runLocal.sh - run on local docker engine
- scripts/runOnBluemix.sh - run on bluemix
- scripts/attachOnBluemix.sh - attach to bluemix bash process
