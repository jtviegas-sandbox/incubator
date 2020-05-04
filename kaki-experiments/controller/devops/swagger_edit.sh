#!/bin/sh

echo "running..."
folder=$(dirname $(readlink -f $0))
base=$(dirname $folder)

SRC=$base/src
_pwd=`pwd`

cd $SRC
echo "...retriving modules..."
npm install
echo "...starting..."
swagger project edit
cd $_pwd
echo "...done."


