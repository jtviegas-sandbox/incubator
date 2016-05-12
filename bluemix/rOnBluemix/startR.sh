#!/bin/sh

. ./vars.sh

env
java -version

$R_HOME/bin/R --save <<RPROG
	setwd("$TASKS_DIR")
	r <- getOption("repos")
	r["CRAN"] <- "$CRAN_MIRROR"
	options(repos=r)
	print('R is ready!')
RPROG

while true; do
	env
	for entry in "$TASKS_DIR"/*.r
	do
		echo "going to process file $entry"
  		$R_HOME/bin/R --gui-none --no-save -f "$entry"
	done
	sleep 5
done

