#!/bin/bash

$CASS_PATH/cqlsh cassandra-0.cassandra 9042 -e "select * from testing.test"
$CASS_PATH/cqlsh cassandra-1.cassandra 9042 -e "select * from testing.test"
$CASS_PATH/cqlsh cassandra-2.cassandra 9042 -e "select * from testing.test"
