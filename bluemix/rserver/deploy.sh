#!/bin/sh

cf push rserver -b https://github.com/jtviegas/bluemix-R-buildpack.git --no-route
cf create-service mongolab sandbox mongo
cf bind-service rserver mongo
cf restage rserver

