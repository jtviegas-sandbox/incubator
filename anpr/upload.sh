#!/bin/sh
       
if [ -z "$1" ];then
	echo "!!!must supply the image path!!!"
    exit 1
fi

http -f POST http://129.41.227.179:8080/api/photo/ file@$1
