#!/bin/bash

curl -H "Content-Type: application/json" -d '{"requestToken":"reqtoken","accountId":"accountid","sessionId":"sessionId"}' http://xperiment.mybluemix.net/api/auth/add
