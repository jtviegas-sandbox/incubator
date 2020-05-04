#!/bin/bash


devops_folder=$(dirname $(readlink -f $0))
base_folder=$(dirname $devops_folder)

. $devops_folder/VARS.sh

#IMAGE_ID=`docker images | grep -E "^$IMAGE*" | awk -e '{print $3}'`
#IMAGE_ID=cf ic images | grep -E "^$BLUEMIX_IMG" | awk -e '{print $3}'

#docker tag $IMAGE_ID $BLUEMIX_IMG
#docker push $BLUEMIX_IMG

CONTAINER_ID=`cf ic ps -a | grep -E "$BLUEMIX_IMG:latest" | awk -e '{print $1}'`
echo "...container id: $CONTAINER_ID"

if [ ! -z "$CONTAINER_ID" ]; then

	cf ic stop $CONTAINER_ID

	stopped="1"
	while [ "$stopped" -ne "0" ]
	do
	        cf ic ps -a | grep $CONTAINER_ID | grep Shutdown
	        stopped=$?
	        echo "has container stopped (0=true) ? $stopped"
	        sleep 6
	done

	cf ic rm $CONTAINER_ID

	removed="0"
	while [ "$removed" -ne "1" ]
	do
	        cf ic ps -a | grep $CONTAINER_ID
	        removed=$?
	        echo "has container been removed (1=true) ? $removed"
	        sleep 6
	done

fi

IPs=`cf ic ip list | grep -o '[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}'`
if [ ! -z "$IPs" ]; then
    IPs=`echo "$IPs" | tr '\n' ' '`
    echo "we have IPs: $IPs"
    IFS=' ' read -r -a o <<< "$IPs"
    echo "o: ${o[@]}"
    BLUEMIX_IP=${o[0]}
else
    BLUEMIX_IP=`cf ic ip request | awk -e '{print $4}' | tr -d '\n' | tr -d '"'`
fi

echo "BLUEMIX_IP: $BLUEMIX_IP"

cf ic run -d --name $CONTAINER -p $PORT --link $KF_CONTAINER:$KF_HOST --link $ZK_CONTAINER:$ZK_HOST  --env "EXTERNAL_IP=$BLUEMIX_IP" -m $BLUEMIX_CONTAINER_MEMORY $BLUEMIX_IMG

running="1"
while [ "$running" -ne "0" ]
do
        cf ic ps -a | grep $CONTAINER | grep Running
        running=$?
        echo "is container running (0=true) ? $running"
        sleep 6
done

cf ic ip bind $BLUEMIX_IP $CONTAINER
sleep 24
cf ic logs -f $CONTAINER
