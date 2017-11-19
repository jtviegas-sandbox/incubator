#!/bin/bash

$CASS_PATH/cqlsh cassandra 9042 -e "describe keyspaces"
$CASS_PATH/cqlsh cassandra 9042 -e "create keyspace if not exists testing with replication = { 'class' : 'SimpleStrategy', 'replication_factor' : 3 }"
$CASS_PATH/cqlsh cassandra 9042 -e "create table testing.readings (sensor text,id uuid,metric text,value float,properties map<text,text>,relationships set<text>,config tuple<text,int>, primary key(sensor,id))with clustering order by (id desc);"
$CASS_PATH/cqlsh cassandra 9042 -e "use testing;describe readings"

