#!/bin/bash

_CONSISTENCY_LEVEL=ONE
if [ $1 ]; then
	_CONSISTENCY_LEVEL=$1
fi
echo "reading data with consistency level $_CONSISTENCY_LEVEL"

$CASS_PATH/cqlsh cassandra 9042 -e "CONSISTENCY $_CONSISTENCY_LEVEL; select * from testing.readings;"
