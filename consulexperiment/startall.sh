#!/bin/sh

MAIN_SERVER=consulmain
BACKUP_SERVER=consulbackup

./consulmain_run.sh
./consulbackup_run.sh $MAIN_SERVER
./consulclient_run.sh $MAIN_SERVER $BACKUP_SERVER
./consulservice_run.sh $MAIN_SERVER $BACKUP_SERVER

