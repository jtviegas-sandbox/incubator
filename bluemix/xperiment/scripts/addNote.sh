#!/bin/bash

curl -H "Content-Type: application/json" -d '{"accountId":"myaccount","text":"my quote is youraquote","type":1,"priority":1,"mustDoTimestamp":0,"doneTimestamp":0,"creationTimestamp":0}' http://xperiment.mybluemix.net/api/notes/add
