# Cassandra High Availability experiment on Kubernetes

1. Start by creating one account in [Google Cloud Platform](https://cloud.google.com/) and, once done, use your account to create a project, in this example we’ve used a project named _haveagolab_;
2. [setup gcloud and kubectl](https://v1-7.docs.kubernetes.io/docs/tasks/tools/install-kubectl/#download-as-part-of-the-google-cloud-sdk)
3. download this experiment bundle from [dist/cassandra-k8s.tar.bz2](https://github.com/jtviegas/incubator/raw/master/k8s/dist/cassandra-k8s.tar.bz2) and extract it to a base folder, move your shell to that folder; you should see once you ```ls```:
```
$ ls
config  README.md  scripts
```

4. edit the variable ```GKE_PROJECT```, ```PASSWORD``` and ```USERNAME``` variables in ```scripts/ENV.inc``` accordingly to step \#1;

5. create a cluster
```$ ./scripts/create_cluster.sh```

...you should see something like this in the output:
```
NAME         ZONE            MASTER_VERSION  MASTER_IP  MACHINE_TYPE   NODE_VERSION  NUM_NODES  STATUS
cluster-one  europe-west3-b  1.7.8-gke.0                n1-standard-1  1.7.8-gke.0   5          PROVISIONING
```
6. connect  your shell gcloud environment to the cluster
```
$ ./scripts/connect_cluster.sh 
>>> connection to cluster ...
Fetching cluster endpoint and auth data.
kubeconfig entry generated for cluster-one.
>>> ... done.
```

7. check the status of the cluster
```
$ ./scripts/get_objects.sh 
>>> running: kubectl get services,pods,deployments,sts -o wide --show-labels
NAME             TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)   AGE       SELECTOR   LABELS
svc/kubernetes   ClusterIP   10.19.240.1   <none>        443/TCP   10m       <none>     component=apiserver,provider=kubernetes
>>> ... done.
```

8. create an headless service, to provide internal name resolution for the cassandra nodes
```
$ ./scripts/create_headless_service.sh 
>>> creating cassandra headless service to provide internal dns to cassandra nodes...
service "cassandra" created
>>> ... done.
>>> running: kubectl get services -o wide --show-labels
NAME         TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE       SELECTOR        LABELS
cassandra    ClusterIP   None          <none>        9042/TCP   0s        app=cassandra   app=cassandra
kubernetes   ClusterIP   10.19.240.1   <none>        443/TCP    11m       <none>          component=apiserver,provider=kubernetes
>>> ... done.
```

9. create the stateful set of cassandra nodes
```
$ ./scripts/create_stateful_set.sh 
>>> creating cassandra stateful set...
statefulset "cassandra" created
>>> ... done.
```

10. after a couple of minutes you'll be able to see all the 5 nodes already created, wait until the nodes are all created and with status=Running:
```
$ ./scripts/get_objects.sh 
>>> running: kubectl get services,pods,deployments,sts -o wide --show-labels
NAME             TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE       SELECTOR        LABELS
svc/cassandra    ClusterIP   None          <none>        9042/TCP   15m       app=cassandra   app=cassandra
svc/kubernetes   ClusterIP   10.19.240.1   <none>        443/TCP    27m       <none>          component=apiserver,provider=kubernetes

NAME             READY     STATUS    RESTARTS   AGE       IP          NODE                                         LABELS
po/cassandra-0   1/1       Running   0          10m       10.16.3.7   gke-cluster-one-default-pool-220c9daa-0pg0   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-1   1/1       Running   0          10m       10.16.1.4   gke-cluster-one-default-pool-220c9daa-xbph   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-2   1/1       Running   0          9m        10.16.2.5   gke-cluster-one-default-pool-220c9daa-jm2c   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-3   1/1       Running   0          9m        10.16.0.3   gke-cluster-one-default-pool-220c9daa-jzdp   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-4   1/1       Running   0          8m        10.16.4.4   gke-cluster-one-default-pool-220c9daa-3c18   app=cassandra,controller-revision-hash=cassandra-1097087426

NAME                     DESIRED   CURRENT   AGE       CONTAINERS   IMAGES                                LABELS
statefulsets/cassandra   5         5         10m       cassandra    gcr.io/google-samples/cassandra:v12   app=cassandra
>>> ... done.
```

11. create the cassandra client app - this is a simple container with the cassandra binary tools for testing purposes, that will be part of cassandra network in the kubernetes cluster, to which we will connect and invoke commands on the cassandra ring:
```
$ ./scripts/create_client.sh 
>>> creating cassandra client app...
pod "cassandra-client" created
>>> ... done.
```

12. now wait until the nodes are all created and with status=Running
```
$ ./scripts/get_objects.sh 
>>> running: kubectl get services,pods,deployments,sts -o wide --show-labels
NAME             TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE       SELECTOR        LABELS
svc/cassandra    ClusterIP   None          <none>        9042/TCP   19m       app=cassandra   app=cassandra
svc/kubernetes   ClusterIP   10.19.240.1   <none>        443/TCP    30m       <none>          component=apiserver,provider=kubernetes

NAME                  READY     STATUS    RESTARTS   AGE       IP          NODE                                         LABELS
po/cassandra-0        1/1       Running   0          13m       10.16.3.7   gke-cluster-one-default-pool-220c9daa-0pg0   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-1        1/1       Running   0          13m       10.16.1.4   gke-cluster-one-default-pool-220c9daa-xbph   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-2        1/1       Running   0          13m       10.16.2.5   gke-cluster-one-default-pool-220c9daa-jm2c   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-3        1/1       Running   0          12m       10.16.0.3   gke-cluster-one-default-pool-220c9daa-jzdp   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-4        1/1       Running   0          12m       10.16.4.4   gke-cluster-one-default-pool-220c9daa-3c18   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-client   1/1       Running   0          1m        10.16.3.8   gke-cluster-one-default-pool-220c9daa-0pg0   app=cassandra

NAME                     DESIRED   CURRENT   AGE       CONTAINERS   IMAGES                                LABELS
statefulsets/cassandra   5         5         13m       cassandra    gcr.io/google-samples/cassandra:v12   app=cassandra
>>> ... done.
```

13. check cassandra pods status:
```
$ ./scripts/nodetool_status.sh 
>>> running 'nodetool status' on all nodes...
Datacenter: DC1-K8Demo
======================
Status=Up/Down
|/ State=Normal/Leaving/Joining/Moving
--  Address    Load       Tokens       Owns (effective)  Host ID                               Rack
UN  10.16.0.3  99.44 KiB  32           47.0%             8e9c889d-2c42-44a9-b436-4e342a97eca7  Rack1-K8Demo
UN  10.16.1.4  99.44 KiB  32           35.4%             e8d22a05-8c11-4a9f-aef5-e4c37e2b2f91  Rack1-K8Demo
UN  10.16.4.4  99.44 KiB  32           42.4%             b98e4d4a-c4b0-40be-b049-bddb6fe8efe9  Rack1-K8Demo
UN  10.16.2.5  103.83 KiB  32           40.9%             9a44ea9c-d45c-4d19-bc31-96b22aeea0d1  Rack1-K8Demo
UN  10.16.3.7  65.64 KiB  32           34.3%             5a79a45c-353b-4574-97a4-e5a14bee90b3  Rack1-K8Demo

```

14. we can also now connect to the client app
```
$ ./scripts/login_client.sh 
>>> connecting to cassandra client app...
root@cassandra-client:/opt/app# ls
app.js  insert_data.sh  node_modules  package.json  read_data.sh  setup_data.sh
root@cassandra-client:/opt/app#
```
13. and once in the client app we can:

	1. setup data - create keyspace and a table :
		
		content of 	```setup_data.sh```:
		```
		describe keyspaces;
		create keyspace if not exists testing with replication = { 'class' : 'SimpleStrategy', 'replication_factor' : 3 };
		create table testing.readings (sensor text,id uuid,metric text,value float,properties map<text,text>,relationships set<text>,config tuple<text,int>, primary key(sensor,id)) with clustering order by (id desc);
		use testing;describe readings;
		```

		```
		root@cassandra-client:/opt/app# ./setup_data.sh
		system_traces  system_schema  system_auth  system  system_distributed

		CREATE TABLE testing.readings (
		    sensor text,
		    id uuid,
		    config frozen<tuple<text, int>>,
		    metric text,
		    properties map<text, text>,
		    relationships set<text>,
		    value float,
		    PRIMARY KEY (sensor, id)
		) WITH CLUSTERING ORDER BY (id DESC)
		    AND bloom_filter_fp_chance = 0.01
		    AND caching = {'keys': 'ALL', 'rows_per_partition': 'NONE'}
		    AND comment = ''
		    AND compaction = {'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4'}
		    AND compression = {'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor'}
		    AND crc_check_chance = 1.0
		    AND dclocal_read_repair_chance = 0.1
		    AND default_time_to_live = 0
		    AND gc_grace_seconds = 864000
		    AND max_index_interval = 2048
		    AND memtable_flush_period_in_ms = 0
		    AND min_index_interval = 128
		    AND read_repair_chance = 0.0
		    AND speculative_retry = '99PERCENTILE';
		```


	2. insert_data - we will insert 8 rows in the table ```readings```:

		content of 	```insert_data.sh```:
		```
		_CONSISTENCY_LEVEL=ONE
		if [ $1 ]; then
			_CONSISTENCY_LEVEL=$1
		fi

		_SENSOR=sensor1
		if [ $2 ]; then
			_SENSOR=$2
		fi
		rand_num=`awk -v min=0 -v max=25 'BEGIN{srand(); print int(min+rand()*(max-min+1))}'`
		rand_str=`head /dev/urandom | tr -dc A-Za-z0-9 | head -c 13 ; echo ''`

		CONSISTENCY $_CONSISTENCY_LEVEL; insert into testing.readings ( sensor, id, metric, value, properties ) values ('$_SENSOR',now(),'$rand_str' , $rand_num, {'status': 'ok', 'color': 'green'});
		```

		```
		root@cassandra-client:/opt/app# ./insert_data.sh ALL sensor2
		inserting data with consistency level ALL related to sensor sensor2
		Consistency level set to ALL.
		root@cassandra-client:/opt/app# ./insert_data.sh ALL sensor1
		inserting data with consistency level ALL related to sensor sensor1
		Consistency level set to ALL.
		root@cassandra-client:/opt/app# ./insert_data.sh ALL sensor3
		inserting data with consistency level ALL related to sensor sensor3
		Consistency level set to ALL.
		root@cassandra-client:/opt/app# ./insert_data.sh ALL sensor4
		inserting data with consistency level ALL related to sensor sensor4
		Consistency level set to ALL.
		root@cassandra-client:/opt/app# ./insert_data.sh ALL sensor5
		inserting data with consistency level ALL related to sensor sensor5
		Consistency level set to ALL.
		root@cassandra-client:/opt/app# ./insert_data.sh ALL sensor2
		inserting data with consistency level ALL related to sensor sensor2
		Consistency level set to ALL.
		root@cassandra-client:/opt/app# ./insert_data.sh ALL sensor3
		inserting data with consistency level ALL related to sensor sensor3
		Consistency level set to ALL.
		root@cassandra-client:/opt/app# ./insert_data.sh ALL sensor4
		inserting data with consistency level ALL related to sensor sensor4
		Consistency level set to ALL.
		```

	3. read_data - from the table

		content of 	```read_data.sh```:
		```
		_CONSISTENCY_LEVEL=ONE
		if [ $1 ]; then
			_CONSISTENCY_LEVEL=$1
		fi
		echo "reading data with consistency level $_CONSISTENCY_LEVEL"

		$CASS_PATH/cqlsh cassandra 9042 -e "CONSISTENCY $_CONSISTENCY_LEVEL; select * from testing.readings;"

		```

		```
		root@cassandra-client:/opt/app# ./read_data.sh QUORUM
		reading data with consistency level QUORUM
		Consistency level set to QUORUM.

		 sensor  | id                                   | config | metric        | properties                         | relationships | value
		---------+--------------------------------------+--------+---------------+------------------------------------+---------------+-------
		 sensor2 | 2112e060-cd5c-11e7-945b-077857dfc153 |   null | RlzWxT4W7YFA4 | {'color': 'green', 'status': 'ok'} |          null |    13
		 sensor2 | 17dc7a60-cd5c-11e7-86f0-01577b062c1f |   null | r7zNe5APo5NXV | {'color': 'green', 'status': 'ok'} |          null |    14
		 sensor3 | 23446660-cd5c-11e7-8501-d59e1504f09b |   null | XL2iqsf39kdTV | {'color': 'green', 'status': 'ok'} |          null |     1
		 sensor3 | 1b626cd0-cd5c-11e7-945b-077857dfc153 |   null | j73c1E5cUrIPn | {'color': 'green', 'status': 'ok'} |          null |     8
		 sensor1 | 19bf4420-cd5c-11e7-86f0-01577b062c1f |   null | w3vXhi8k7ZjKi | {'color': 'green', 'status': 'ok'} |          null |    24
		 sensor5 | 1f41f0f0-cd5c-11e7-bf4f-efe55197b6bc |   null | sHUWe8ewfWG0s | {'color': 'green', 'status': 'ok'} |          null |     3
		 sensor4 | 24f96960-cd5c-11e7-8501-d59e1504f09b |   null | bxBT28hC2SaLY | {'color': 'green', 'status': 'ok'} |          null |    11
		 sensor4 | 1d3b4b80-cd5c-11e7-b730-4d58add19bba |   null | qhSqfv5cocWxo | {'color': 'green', 'status': 'ok'} |          null |    19

		(8 rows)
		```


14. we can also now inspect the node status in our testing environment (not in the client app container):
	```
	$ ./scripts/nodetool_status.sh 
	>>> running 'nodetool status' on all nodes...
	Datacenter: DC1-K8Demo
	======================
	Status=Up/Down
	|/ State=Normal/Leaving/Joining/Moving
	--  Address    Load       Tokens       Owns (effective)  Host ID                               Rack
	UN  10.16.0.3  103.28 KiB  32           60.6%             8e9c889d-2c42-44a9-b436-4e342a97eca7  Rack1-K8Demo
	UN  10.16.1.4  103.07 KiB  32           51.8%             e8d22a05-8c11-4a9f-aef5-e4c37e2b2f91  Rack1-K8Demo
	UN  10.16.4.4  103.03 KiB  32           65.2%             b98e4d4a-c4b0-40be-b049-bddb6fe8efe9  Rack1-K8Demo
	UN  10.16.2.5  104.25 KiB  32           66.2%             9a44ea9c-d45c-4d19-bc31-96b22aeea0d1  Rack1-K8Demo
	UN  10.16.3.7  126 KiB    32           56.2%             5a79a45c-353b-4574-97a4-e5a14bee90b3  Rack1-K8Demo
	```

	...here we can see that every node has approximately 60% os the data, which turns out to be the 

	_replication factor_ \* _number of tokens assigned_

	Remember that we've created the keyspace testing with _replication factor_ 3 (\#13.i), and also note that we've inserted 5 different sensors, which column sensor is the partition key the readings table.
	That means the tokens are evenly distributed by the nodes and having 5 nodes with 5 tokens means that each node has approximately 20% of all the tokens range, so multiplying it by the replication factor, 20 \* 3, we get a number in the vicinity of 60%. 


15. so now lets force the failure of a cassandra node deleting a cassandra pod in kubernetes: 

```
$ scripts/delete_cassandra_pod.sh 1
>>> deleting pod cassandra-1...
pod "cassandra-1" deleted
>>> ... done.
>>> running: kubectl get services,pods,deployments,sts -o wide --show-labels
NAME             TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE       SELECTOR        LABELS
svc/cassandra    ClusterIP   None          <none>        9042/TCP   2h        app=cassandra   app=cassandra
svc/kubernetes   ClusterIP   10.19.240.1   <none>        443/TCP    2h        <none>          component=apiserver,provider=kubernetes

NAME                  READY     STATUS        RESTARTS   AGE       IP          NODE                                         LABELS
po/cassandra-0        1/1       Running       0          2h        10.16.3.7   gke-cluster-one-default-pool-220c9daa-0pg0   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-1        1/1       Terminating   0          2h        10.16.1.4   gke-cluster-one-default-pool-220c9daa-xbph   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-2        1/1       Running       0          2h        10.16.2.5   gke-cluster-one-default-pool-220c9daa-jm2c   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-3        1/1       Running       0          2h        10.16.0.3   gke-cluster-one-default-pool-220c9daa-jzdp   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-4        1/1       Running       0          2h        10.16.4.4   gke-cluster-one-default-pool-220c9daa-3c18   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-client   1/1       Running       0          1h        10.16.3.8   gke-cluster-one-default-pool-220c9daa-0pg0   app=cassandra

NAME                     DESIRED   CURRENT   AGE       CONTAINERS   IMAGES                                LABELS
statefulsets/cassandra   5         5         2h        cassandra    gcr.io/google-samples/cassandra:v12   app=cassandra
>>> ... done.

```

16. wait until kubernetes provisions another pod to replace the deceased one:

```
$ scripts/get_objects.sh 
>>> running: kubectl get services,pods,deployments,sts -o wide --show-labels
NAME             TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE       SELECTOR        LABELS
svc/cassandra    ClusterIP   None          <none>        9042/TCP   2h        app=cassandra   app=cassandra
svc/kubernetes   ClusterIP   10.19.240.1   <none>        443/TCP    2h        <none>          component=apiserver,provider=kubernetes

NAME                  READY     STATUS    RESTARTS   AGE       IP          NODE                                         LABELS
po/cassandra-0        1/1       Running   0          2h        10.16.3.7   gke-cluster-one-default-pool-220c9daa-0pg0   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-1        1/1       Running   0          1m        10.16.1.5   gke-cluster-one-default-pool-220c9daa-xbph   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-2        1/1       Running   0          2h        10.16.2.5   gke-cluster-one-default-pool-220c9daa-jm2c   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-3        1/1       Running   0          2h        10.16.0.3   gke-cluster-one-default-pool-220c9daa-jzdp   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-4        1/1       Running   0          2h        10.16.4.4   gke-cluster-one-default-pool-220c9daa-3c18   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-client   1/1       Running   0          1h        10.16.3.8   gke-cluster-one-default-pool-220c9daa-0pg0   app=cassandra

NAME                     DESIRED   CURRENT   AGE       CONTAINERS   IMAGES                                LABELS
statefulsets/cassandra   5         5         2h        cassandra    gcr.io/google-samples/cassandra:v12   app=cassandra
>>> ... done.

```

17. back on the client app, lets read the data again:


```
root@cassandra-client:/opt/app# ./read_data.sh QUORUM
reading data with consistency level QUORUM
Consistency level set to QUORUM.

 sensor  | id                                   | config | metric        | properties                         | relationships | value
---------+--------------------------------------+--------+---------------+------------------------------------+---------------+-------
 sensor2 | 2112e060-cd5c-11e7-945b-077857dfc153 |   null | RlzWxT4W7YFA4 | {'color': 'green', 'status': 'ok'} |          null |    13
 sensor2 | 17dc7a60-cd5c-11e7-86f0-01577b062c1f |   null | r7zNe5APo5NXV | {'color': 'green', 'status': 'ok'} |          null |    14
 sensor3 | 23446660-cd5c-11e7-8501-d59e1504f09b |   null | XL2iqsf39kdTV | {'color': 'green', 'status': 'ok'} |          null |     1
 sensor3 | 1b626cd0-cd5c-11e7-945b-077857dfc153 |   null | j73c1E5cUrIPn | {'color': 'green', 'status': 'ok'} |          null |     8
 sensor1 | 19bf4420-cd5c-11e7-86f0-01577b062c1f |   null | w3vXhi8k7ZjKi | {'color': 'green', 'status': 'ok'} |          null |    24
 sensor5 | 1f41f0f0-cd5c-11e7-bf4f-efe55197b6bc |   null | sHUWe8ewfWG0s | {'color': 'green', 'status': 'ok'} |          null |     3
 sensor4 | 24f96960-cd5c-11e7-8501-d59e1504f09b |   null | bxBT28hC2SaLY | {'color': 'green', 'status': 'ok'} |          null |    11
 sensor4 | 1d3b4b80-cd5c-11e7-b730-4d58add19bba |   null | qhSqfv5cocWxo | {'color': 'green', 'status': 'ok'} |          null |    19

(8 rows)
```

18. let's inspect data state across the nodes with Cassandra nodetool script:
```
$ ./scripts/nodetool_status.sh 
>>> running 'nodetool status' on all nodes...
Datacenter: DC1-K8Demo
======================
Status=Up/Down
|/ State=Normal/Leaving/Joining/Moving
--  Address    Load       Tokens       Owns (effective)  Host ID                               Rack
UN  10.16.0.3  132.76 KiB  32           54.9%             8e9c889d-2c42-44a9-b436-4e342a97eca7  Rack1-K8Demo
DN  10.16.1.4  132.29 KiB  32           44.2%             e8d22a05-8c11-4a9f-aef5-e4c37e2b2f91  Rack1-K8Demo
UN  10.16.4.4  132.28 KiB  32           54.4%             b98e4d4a-c4b0-40be-b049-bddb6fe8efe9  Rack1-K8Demo
UN  10.16.2.5  133.69 KiB  32           48.3%             9a44ea9c-d45c-4d19-bc31-96b22aeea0d1  Rack1-K8Demo
UN  10.16.1.5  85.44 KiB  32           51.4%             cd34f561-a47f-4f1e-a77c-5112ceaa8add  Rack1-K8Demo
UN  10.16.3.7  149.55 KiB  32           46.9%             5a79a45c-353b-4574-97a4-e5a14bee90b3  Rack1-K8Demo
```

...we have now one cassandra node missing (status Down on the 2nd line), as far as cassandra can tell. 
Kubernetes provisioned another pod, so now we have 6 nodes, thus every node has 16.7% of the token range, times the replication factor, on average now every node has 50% of the data, as shown by the nodetool status output.

19. so now lets force the failure of 2 additional cassandra nodes:
```
$ scripts/delete_cassandra_pod.sh 2
>>> deleting pod cassandra-2...
pod "cassandra-2" deleted
>>> ... done.
jtviegas@osboxes:~/Documents/workspace/incubator/k8s$ scripts/delete_cassandra_pod.sh 4
>>> deleting pod cassandra-4...
pod "cassandra-4" deleted
>>> ... done.
jtviegas@osboxes:~/Documents/workspace/incubator/k8s$ scripts/get_objects.sh 
>>> running: kubectl get services,pods,deployments,sts -o wide --show-labels
NAME             TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE       SELECTOR        LABELS
svc/cassandra    ClusterIP   None          <none>        9042/TCP   2h        app=cassandra   app=cassandra
svc/kubernetes   ClusterIP   10.19.240.1   <none>        443/TCP    2h        <none>          component=apiserver,provider=kubernetes

NAME                  READY     STATUS    RESTARTS   AGE       IP          NODE                                         LABELS
po/cassandra-0        1/1       Running   0          2h        10.16.3.7   gke-cluster-one-default-pool-220c9daa-0pg0   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-1        1/1       Running   0          13m       10.16.1.5   gke-cluster-one-default-pool-220c9daa-xbph   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-2        1/1       Running   0          1m        10.16.2.6   gke-cluster-one-default-pool-220c9daa-jm2c   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-3        1/1       Running   0          2h        10.16.0.3   gke-cluster-one-default-pool-220c9daa-jzdp   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-4        1/1       Running   0          1m        10.16.4.5   gke-cluster-one-default-pool-220c9daa-3c18   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-client   1/1       Running   0          2h        10.16.3.8   gke-cluster-one-default-pool-220c9daa-0pg0   app=cassandra

NAME                     DESIRED   CURRENT   AGE       CONTAINERS   IMAGES                                LABELS
statefulsets/cassandra   5         5         2h        cassandra    gcr.io/google-samples/cassandra:v12   app=cassandra
>>> ... done.
```

20. back on the client app, lets check the data again but this time lets try to find records of sensor1 and sensor2 with CONSISTENCY LEVEL ONE, that is, we want just one answer and we accept the first one arriving:

content of 	```check_data.sh```:
```
_CONSISTENCY_LEVEL=ONE
if [ $1 ]; then
	_CONSISTENCY_LEVEL=$1
fi
echo "checking data from sensor1 and sensor2 with consistency level $_CONSISTENCY_LEVEL"

$CASS_PATH/cqlsh cassandra 9042 -e "CONSISTENCY $_CONSISTENCY_LEVEL; select * from testing.readings where sensor in ('sensor1','sensor2');"

```

```
root@cassandra-client:/opt/app# ./check_data.sh ONE
reading data from sensor1 and sensor2 with consistency level ONE
Consistency level set to ONE.

 sensor  | id                                   | config | metric        | properties                         | relationships | value
---------+--------------------------------------+--------+---------------+------------------------------------+---------------+-------
 sensor1 | 19bf4420-cd5c-11e7-86f0-01577b062c1f |   null | w3vXhi8k7ZjKi | {'color': 'green', 'status': 'ok'} |          null |    24

(1 rows)
root@cassandra-client:/opt/app# ./check_data.sh ONE
reading data from sensor1 and sensor2 with consistency level ONE
Consistency level set to ONE.

 sensor  | id                                   | config | metric        | properties                         | relationships | value
---------+--------------------------------------+--------+---------------+------------------------------------+---------------+-------
 sensor1 | 19bf4420-cd5c-11e7-86f0-01577b062c1f |   null | w3vXhi8k7ZjKi | {'color': 'green', 'status': 'ok'} |          null |    24
 sensor2 | 2112e060-cd5c-11e7-945b-077857dfc153 |   null | RlzWxT4W7YFA4 | {'color': 'green', 'status': 'ok'} |          null |    13
 sensor2 | 17dc7a60-cd5c-11e7-86f0-01577b062c1f |   null | r7zNe5APo5NXV | {'color': 'green', 'status': 'ok'} |          null |    14

(3 rows)
root@cassandra-client:/opt/app# ./check_data.sh ONE
reading data from sensor1 and sensor2 with consistency level ONE
Consistency level set to ONE.

 sensor  | id                                   | config | metric        | properties                         | relationships | value
---------+--------------------------------------+--------+---------------+------------------------------------+---------------+-------
 sensor1 | 19bf4420-cd5c-11e7-86f0-01577b062c1f |   null | w3vXhi8k7ZjKi | {'color': 'green', 'status': 'ok'} |          null |    24
 sensor2 | 2112e060-cd5c-11e7-945b-077857dfc153 |   null | RlzWxT4W7YFA4 | {'color': 'green', 'status': 'ok'} |          null |    13
 sensor2 | 17dc7a60-cd5c-11e7-86f0-01577b062c1f |   null | r7zNe5APo5NXV | {'color': 'green', 'status': 'ok'} |          null |    14

(3 rows)
```

Here we are seing the effect of data repair, in the first call, the first node answering was responsible for sensor1 token range and its answer was accurate, but regarding sensor2 token range, this first answering node was a new one, that got that token range assigned after the bringing down of those other 3 cassandra nodes, and this new node has not yet received any new data, but in that process, there was another node that had a replica of those sensor2 rows, and even conveying the empty answer of the first node, Cassandra figured out that data was not synchronized between those nodes and forced the repair. That is why after this first call to ```check _data.sh``` we have already all the data from both sensors there, and now even a ```QUORUM``` consistency level gives us the values:
```
root@cassandra-client:/opt/app# ./check_data.sh QUORUM
reading data from sensor1 and sensor2 with consistency level QUORUM
Consistency level set to QUORUM.

 sensor  | id                                   | config | metric        | properties                         | relationships | value
---------+--------------------------------------+--------+---------------+------------------------------------+---------------+-------
 sensor1 | 19bf4420-cd5c-11e7-86f0-01577b062c1f |   null | w3vXhi8k7ZjKi | {'color': 'green', 'status': 'ok'} |          null |    24
 sensor2 | 2112e060-cd5c-11e7-945b-077857dfc153 |   null | RlzWxT4W7YFA4 | {'color': 'green', 'status': 'ok'} |          null |    13
 sensor2 | 17dc7a60-cd5c-11e7-86f0-01577b062c1f |   null | r7zNe5APo5NXV | {'color': 'green', 'status': 'ok'} |          null |    14

(3 rows)
```

21. reading the data with ```QUORUM```:
```
root@cassandra-client:/opt/app# ./read_data.sh QUORUM        
reading data with consistency level QUORUM
Consistency level set to QUORUM.
<stdin>:1:Traceback (most recent call last):
  File "/opt/apache-cassandra-3.11.1/bin/cqlsh.py", line 1044, in perform_simple_statement
    result = future.result()
  File "/opt/apache-cassandra-3.11.1/bin/../lib/cassandra-driver-internal-only-3.10.zip/cassandra-driver-3.10/cassandra/cluster.py", line 3826, in result
    raise self._final_exception
Unavailable: Error from server: code=1000 [Unavailable exception] message="Cannot achieve consistency level QUORUM" info={'required_replicas': 2, 'alive_replicas': 1, 'consistency': 'QUORUM'}
```

...shows us that we can't have ```QUORUM``` for all the tokens, as this is an open select query for all the sensors, but we do have for ```CONSISTENCY LEVEL ONE```, even though we don't have all the data there:
```
root@cassandra-client:/opt/app# ./read_data.sh ONE   
reading data with consistency level ONE
Consistency level set to ONE.

 sensor  | id                                   | config | metric        | properties                         | relationships | value
---------+--------------------------------------+--------+---------------+------------------------------------+---------------+-------
 sensor2 | 2112e060-cd5c-11e7-945b-077857dfc153 |   null | RlzWxT4W7YFA4 | {'color': 'green', 'status': 'ok'} |          null |    13
 sensor2 | 17dc7a60-cd5c-11e7-86f0-01577b062c1f |   null | r7zNe5APo5NXV | {'color': 'green', 'status': 'ok'} |          null |    14
 sensor1 | 19bf4420-cd5c-11e7-86f0-01577b062c1f |   null | w3vXhi8k7ZjKi | {'color': 'green', 'status': 'ok'} |          null |    24
 sensor5 | 1f41f0f0-cd5c-11e7-bf4f-efe55197b6bc |   null | sHUWe8ewfWG0s | {'color': 'green', 'status': 'ok'} |          null |     3

(4 rows)
```

22. To understand what is happening here we should inspect the output of ```nodetool status``` again:
```
$ ./scripts/nodetool_status.sh 
>>> running 'nodetool status' on all nodes...
Datacenter: DC1-K8Demo
======================
Status=Up/Down
|/ State=Normal/Leaving/Joining/Moving
--  Address    Load       Tokens       Owns (effective)  Host ID                               Rack
UN  10.16.0.3  149.41 KiB  32           38.5%             8e9c889d-2c42-44a9-b436-4e342a97eca7  Rack1-K8Demo
DN  10.16.1.4  132.29 KiB  32           32.4%             e8d22a05-8c11-4a9f-aef5-e4c37e2b2f91  Rack1-K8Demo
DN  10.16.4.4  132.28 KiB  32           42.3%             b98e4d4a-c4b0-40be-b049-bddb6fe8efe9  Rack1-K8Demo
DN  10.16.2.5  133.69 KiB  32           31.1%             9a44ea9c-d45c-4d19-bc31-96b22aeea0d1  Rack1-K8Demo
UN  10.16.4.5  122.67 KiB  32           41.5%             1c379681-a996-462b-8d09-c4fbbf64045d  Rack1-K8Demo
UN  10.16.1.5  123.07 KiB  32           34.3%             cd34f561-a47f-4f1e-a77c-5112ceaa8add  Rack1-K8Demo
UN  10.16.2.6  103.5 KiB  32           42.2%             53ebf3f5-9d7c-4c34-974e-78323a16850c  Rack1-K8Demo
UN  10.16.3.7  170.97 KiB  32           37.8%             5a79a45c-353b-4574-97a4-e5a14bee90b3  Rack1-K8Demo
```

So what this means is there are still token ranges and data assigned to cassandra nodes that are down, but Cassandra is still hoping they will come up, so it hasn't
yet redistributed the token ranges over the live nodes. Although there are situations where these nodes can be brought back alive, this is not such a situation and thus
what we can do now is to tell Cassandra not to wait for them. So we will force Cassandra to redistribute the tokens over the live nodes only, so back in out test environment:
```
$ ./scripts/nodetool_removenode.sh e8d22a05-8c11-4a9f-aef5-e4c37e2b2f91
>>> removing dead node e8d22a05-8c11-4a9f-aef5-e4c37e2b2f91
>>> ... done.
jtviegas@osboxes:~/Documents/workspace/incubator/k8s$ ./scripts/nodetool_removenode.sh b98e4d4a-c4b0-40be-b049-bddb6fe8efe9
>>> removing dead node b98e4d4a-c4b0-40be-b049-bddb6fe8efe9
>>> ... done.
jtviegas@osboxes:~/Documents/workspace/incubator/k8s$ ./scripts/nodetool_removenode.sh 9a44ea9c-d45c-4d19-bc31-96b22aeea0d1
>>> removing dead node 9a44ea9c-d45c-4d19-bc31-96b22aeea0d1
>>> ... done.
```

23. let's inspect the output of "nodetool status" again:
```
$ ./scripts/nodetool_status.sh 
>>> running 'nodetool status' on all nodes...
Datacenter: DC1-K8Demo
======================
Status=Up/Down
|/ State=Normal/Leaving/Joining/Moving
--  Address    Load       Tokens       Owns (effective)  Host ID                               Rack
UN  10.16.0.3  164.18 KiB  32           61.3%             8e9c889d-2c42-44a9-b436-4e342a97eca7  Rack1-K8Demo
UN  10.16.4.5  126.06 KiB  32           57.2%             1c379681-a996-462b-8d09-c4fbbf64045d  Rack1-K8Demo
UN  10.16.1.5  131.8 KiB  32           59.9%             cd34f561-a47f-4f1e-a77c-5112ceaa8add  Rack1-K8Demo
UN  10.16.2.6  106.79 KiB  32           58.8%             53ebf3f5-9d7c-4c34-974e-78323a16850c  Rack1-K8Demo
UN  10.16.3.7  174.94 KiB  32           62.8%             5a79a45c-353b-4574-97a4-e5a14bee90b3  Rack1-K8Demo
```

...we are back at the initial stage, where there's an average of 60% token range on every node.

24. back in client application let's now try to read the data with ```QUORUM```:
```
root@cassandra-client:/opt/app# ./read_data.sh QUORUM                                                                                                                     
reading data with consistency level QUORUM
Consistency level set to QUORUM.

 sensor  | id                                   | config | metric        | properties                         | relationships | value
---------+--------------------------------------+--------+---------------+------------------------------------+---------------+-------
 sensor2 | 2112e060-cd5c-11e7-945b-077857dfc153 |   null | RlzWxT4W7YFA4 | {'color': 'green', 'status': 'ok'} |          null |    13
 sensor2 | 17dc7a60-cd5c-11e7-86f0-01577b062c1f |   null | r7zNe5APo5NXV | {'color': 'green', 'status': 'ok'} |          null |    14
 sensor3 | 23446660-cd5c-11e7-8501-d59e1504f09b |   null | XL2iqsf39kdTV | {'color': 'green', 'status': 'ok'} |          null |     1
 sensor3 | 1b626cd0-cd5c-11e7-945b-077857dfc153 |   null | j73c1E5cUrIPn | {'color': 'green', 'status': 'ok'} |          null |     8
 sensor1 | 19bf4420-cd5c-11e7-86f0-01577b062c1f |   null | w3vXhi8k7ZjKi | {'color': 'green', 'status': 'ok'} |          null |    24
 sensor5 | 1f41f0f0-cd5c-11e7-bf4f-efe55197b6bc |   null | sHUWe8ewfWG0s | {'color': 'green', 'status': 'ok'} |          null |     3
 sensor4 | 24f96960-cd5c-11e7-8501-d59e1504f09b |   null | bxBT28hC2SaLY | {'color': 'green', 'status': 'ok'} |          null |    11
 sensor4 | 1d3b4b80-cd5c-11e7-b730-4d58add19bba |   null | qhSqfv5cocWxo | {'color': 'green', 'status': 'ok'} |          null |    19

(8 rows)
```
...all the data was replicated across all the live nodes.

The system was resilient to the loss of more than half (3) of its nodes.

















