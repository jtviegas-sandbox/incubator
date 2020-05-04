#!/bin/sh

scripts_folder=$(dirname $(readlink -f $0))
base_folder=$(dirname $scripts_folder)

. $scripts_folder/VARS.sh


CONTAINER_ID=`cf ic ps -a | grep -E "$IMAGE" | awk -e '{print $1}'`
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


docker push $BLUEMIX_IMG
sleep 24

cf ic run -d --name $CONTAINER -p $PORT -m $BLUEMIX_CONTAINER_MEMORY $BLUEMIX_IMG

running="1"
while [ "$running" -ne "0" ]
do
        cf ic ps -a | grep $CONTAINER | grep Running
        running=$?
        echo "is container running (0=true) ? $running"
        sleep 6
done

cf ic rmi $BLUEMIX_IMG

cf ic logs -f $CONTAINER
