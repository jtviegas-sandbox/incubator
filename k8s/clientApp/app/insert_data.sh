#!/bin/bash

_CONSISTENCY_LEVEL=ONE
if [ $1 ]; then
	_CONSISTENCY_LEVEL=$1
fi

_SENSOR=sensor1
if [ $2 ]; then
	_SENSOR=$2
fi

echo "inserting data with consistency level $_CONSISTENCY_LEVEL related to sensor $_SENSOR"

rand_num=`awk -v min=0 -v max=25 'BEGIN{srand(); print int(min+rand()*(max-min+1))}'`
rand_str=`head /dev/urandom | tr -dc A-Za-z0-9 | head -c 13 ; echo ''`

$CASS_PATH/cqlsh cassandra 9042 -e "CONSISTENCY $_CONSISTENCY_LEVEL;insert into testing.readings ( sensor, id, metric, value, properties ) values ('$_SENSOR',now(),'$rand_str' , $rand_num, {'status': 'ok', 'color': 'green'});"
