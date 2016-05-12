#!/bin/sh

cf ic stop $(cf ic ps -aq)
sleep 6
cf ic rm -f $(cf ic ps -aq)

