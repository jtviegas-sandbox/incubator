#!/usr/bin/env bash

scripts_folder=$(dirname $(readlink -f $0))
base_folder=$(dirname $scripts_folder)
src_folder=$base_folder/src

. $scripts_folder/ENV.inc

_pwd=`pwd`
cd $src_folder
python run.py
cd $_pwd



