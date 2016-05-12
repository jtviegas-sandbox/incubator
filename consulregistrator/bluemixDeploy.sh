#!/bin/sh

#not working, have to work on this, maybe create an imge running the command
ice run -p 8500 -p 8400 -p 8600 --name consul mynodeappbue/consul:latest "-node=consul -bootstrap -client=0.0.0.0 -recursor=8.8.8.8"
