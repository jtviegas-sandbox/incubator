#!/bin/sh
. ./VARS.sh
docker build -t $BX_IMG .
docker push $BX_IMG
