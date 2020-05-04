#!/bin/sh
curl -G 'http://localhost:8086/query?pretty=true' --data-urlencode "db=kaki" --data-urlencode "q=SELECT \"text\" FROM \"tweet\""
