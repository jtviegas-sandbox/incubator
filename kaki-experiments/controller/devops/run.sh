#!/bin/sh

echo "running..."
folder=$(dirname $(readlink -f $0))
BASE=$(dirname $folder)

DIST=$BASE/dist
_pwd=`pwd`
cd $DIST
echo "...retriving modules..."
npm install --production
echo "...starting..."
MODE=DEV node app.js
cd $_pwd
echo "...done."


