#!/bin/sh

CONSUL_BIN=/opt/consul/bin/consul
CONFIG_DIR=/opt/consul/etc
BOOTSTRAP_IP=$1
OPTIONS="agent -config-dir=$CONFIG_DIR -join=$BOOTSTRAP_IP"
$CONSUL_BIN $OPTIONS
~                                                                                                          
~                                                                                                          
~                                                                                                          
~                                        

