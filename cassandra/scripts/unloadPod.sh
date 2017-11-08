#!/bin/bash

scripts_folder=$(dirname $(readlink -f $0))

kubectl delete -f $scripts_folder/cass-pod.yaml
