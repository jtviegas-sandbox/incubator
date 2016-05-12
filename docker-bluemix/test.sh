#!/bin/sh

. ./VARS.sh

echo "going to inpect containers loaded"
cf ic ps
echo ""
echo "going to make a get request to first app [ curl http://$IP1:$PORT/ ]"
curl http://$IP1:$PORT/
echo "going to make a get request to 2nd app [ curl http://$IP2:$PORT/ ]"
curl http://$IP2:$PORT/
echo ""
echo "done!"
