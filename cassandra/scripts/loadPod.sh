#!/bin/bash

scripts_folder=$(dirname $(readlink -f $0))

kubectl apply -f $scripts_folder/cass-pod.yaml
