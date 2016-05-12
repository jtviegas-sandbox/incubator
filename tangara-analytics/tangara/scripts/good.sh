#!/bin/sh

echo "------------------------------------------------"
echo "...sending a bad csv..."
echo '1232132231234, "the resource", "the metric", 3244.56' |  \
  http POST http://127.0.0.1:8080/analytics/io/csv   content-type:text/plain;
echo "...sending a correct csv..."
echo '1232132231234, the resource, the metric, 3244.56' |  \
  http POST http://127.0.0.1:8080/analytics/io/csv   content-type:text/plain;

