#!/bin/bash

$CASS_PATH/cqlsh cassandra 9042 -e "select * from testing.test"
$CASS_PATH/cqlsh cassandra 9042 -e "show host"