#!/bin/bash

wget http://www-eu.apache.org/dist/lucene/solr/6.6.0/solr-6.6.0.tgz
tar xzpvf ~/Downloads/solr-6.6.0.tgz
bin/solr start
bin/solr status
bin/solr create -c eleanor -p 8983
