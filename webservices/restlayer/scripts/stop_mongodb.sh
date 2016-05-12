#!/bin/sh
PID_FILE=/var/mongodb/data/pid
pid=`cat $PID_FILE`
kill -kill $pid

