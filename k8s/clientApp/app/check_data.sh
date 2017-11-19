#!/bin/bash

_CONSISTENCY_LEVEL=ONE
if [ $1 ]; then
	_CONSISTENCY_LEVEL=$1
fi
echo "checking data from sensor1 and sensor2 with consistency level $_CONSISTENCY_LEVEL"

$CASS_PATH/cqlsh cassandra 9042 -e "CONSISTENCY $_CONSISTENCY_LEVEL; select * from testing.readings where sensor in ('sensor1','sensor2');"
