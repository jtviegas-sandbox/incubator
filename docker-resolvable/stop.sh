#!/bin/sh

docker stop $(docker ps -aq)
docker rm -f $(docker ps -aq)

