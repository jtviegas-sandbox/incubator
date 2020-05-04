#!/bin/sh
echo "building..."

folder=$(dirname $(readlink -f $0))
base=$(dirname $folder)

FRONTEND=$base/frontend
BACKEND=$base/backend
FRONTEND_BUILD=$FRONTEND/dist
BACKEND_BUILD=$BACKEND/dist

SERVER_DIST=$base/dist
UI_DIST=$SERVER_DIST/public

echo "...cleaning..."
rm -rf $DIST
echo "...building frontend..."
_pwd=`pwd`
cd $FRONTEND
grunt build
if [ "0" != "$?" ]; then
	echo "...frontend build failed...leaving!!!"
	cd $_pwd
	return 1
fi
echo "...building backend..."
cd $_pwd
cd $BACKEND
grunt build
if [ "0" != "$?" ]; then
	echo "...backend build failed...leaving!!!"
	cd $_pwd
	return 1
fi
cd $_pwd

echo "...merging builds..."
mkdir -p $UI_DIST

echo "...merging backend..."
cp -r $BACKEND_BUILD/* $SERVER_DIST/

echo "...merging frontend..."
cp -r $FRONTEND_BUILD/* $UI_DIST/

echo "...done."


