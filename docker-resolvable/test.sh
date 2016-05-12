#!/bin/sh

echo "going to inpect containers loaded [ docker exec app dig app2.docker ]"
docker ps
echo "going to resolve app2 container from app container [ docker exec app dig app2.docker ]"
docker exec app dig app2.docker  
echo "going to resolve app container from app2 container [ docker exec app2 dig app.docker ]"
docker exec app2 dig app.docker
echo "going to make a get request to app through the local mapped ports [ curl localhost:53001 ]"
curl localhost:53001
echo ""
echo "going to make a get request to app2 through the local mapped ports [ curl localhost:53002 ]"
curl localhost:53002
echo ""
echo "done!"