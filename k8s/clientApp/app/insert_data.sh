#!/bin/bash

$CASS_PATH/cqlsh cassandra 9042 -e "describe keyspaces"
$CASS_PATH/cqlsh cassandra 9042 -e "use testing;describe test"
$CASS_PATH/cqlsh cassandra 9042 -e "insert into testing.test ( id, name, age, properties ) values (now(), 'jonathan', 26, {'goodlooking': 'yes', 'thinkshesthebest': 'no'});"
$CASS_PATH/cqlsh cassandra 9042 -e "select * from testing.test"