# grafana
## grafana docker container handling scripts

- hostname: grafana
- expects to resolve the influx database host on environment variable $DB_CONTAINER
- exposes port $PORT for web access to dashboards

### usage:

- edit ENV.inc accordingly:
  ```
  NAME=grafana
  CONTAINER=$NAME
  HOST=$NAME
  SOURCE_IMAGE=grafana/grafana
  IMAGE=$NAME
  PORT=3000
  DB_CONTAINER=influxdb
  BLUEMIX_CONTAINER_MEMORY=128
  REGISTRY=registry.ng.bluemix.net/mynodeappbue
  BLUEMIX_IMG=$REGISTRY/$NAME
  DOCKER_HUB_IMG=kakicode/$NAME
  ```
- scripts/copyImage.sh - pull source docker image and push it to dockerHub (/kakicode/grafana) and private bluemix registry (registry.ng.bluemix.net/mynodeappbue/grafana)
- scripts/runLocalContainer.sh - run on local docker engine
