#!/bin/sh

echo "------------------------------------------------"
echo "...sending a correct json..."
echo '{	"ts":3, "resource": "serverXYZ1","metric": "miles per hour","value": 12345}' |  \
  http POST http://127.0.0.1:8080/analytics/io/csv   content-type:application/json;

