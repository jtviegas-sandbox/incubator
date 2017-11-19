#!/bin/bash

base_folder=$(dirname $(readlink -f $0))
echo "£££ creating dist bundle..."
_pwd=`pwd`
cd $base_folder
tar cjpvf dist/cassandra-k8s.tar.bz2 config scripts README.md
cd $_pwd
echo "£££ ... done."