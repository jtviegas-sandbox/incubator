#!/bin/sh
docker stop consulservice && docker rm consulservice
docker stop consulservice2 && docker rm consulservice2
docker stop consulserver && docker rm consulserver
docker stop registrator && docker rm registrator
