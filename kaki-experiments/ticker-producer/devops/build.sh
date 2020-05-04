#!/bin/sh
echo "building..."

folder=$(dirname $(readlink -f $0))
BASE=$(dirname $folder)

DIST=$BASE/dist
SRC=$BASE/src
_pwd=`pwd`

cd $BASE
echo "...cleaning..."
rm -rf $DIST
echo "...building..."
grunt -d build
if [ "0" != "$?" ]; then
	echo "...backend build failed...leaving!!!"
	cd $_pwd
	return 1
fi
cd $_pwd

echo "...done."

