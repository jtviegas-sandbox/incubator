NAME=flaskexample
IMAGE=$NAME
IMAGE_VERSION=latest
CONTAINER=$NAME
HOST=$NAME

# don't change CONTAINER_PORT it depends on the dockerfile
CONTAINER_PORT=5000
CONTAINER_HOST_NAME=localhost

SERVER_PORT=5000

DOCKER_HUB_IMG=kakicode/$NAME