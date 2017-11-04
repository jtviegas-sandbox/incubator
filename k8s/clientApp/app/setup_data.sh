#!/bin/bash

$CASS_PATH/cqlsh cassandra 9042 -e "describe keyspaces"
$CASS_PATH/cqlsh cassandra 9042 -e "create keyspace if not exists testing with replication = { 'class' : 'SimpleStrategy', 'replication_factor' : 3 }"
$CASS_PATH/cqlsh cassandra 9042 -e "create table testing.test (id uuid primary key, name text, age int, properties map<text,text>, nickames set<text>, goals_year map<int,int>, current_wages float, clubs_season tuple<text,int>);"
$CASS_PATH/cqlsh cassandra 9042 -e "use testing;describe test"