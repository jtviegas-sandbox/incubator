#!/bin/sh

echo "running..."
folder=$(dirname $(readlink -f $0))
base=$(dirname $folder)

DIST=$base/dist
_pwd=`pwd`

cd $DIST
echo "...retriving modules..."
npm install
echo "ATTENTION: do please install node debug as root:  'npm install -g node-debug' "
echo "...starting..."
MODE=DEV node-debug app.js
cd $_pwd
echo "...done."


