1. setup gcloud and kubectl
https://v1-7.docs.kubernetes.io/docs/tasks/tools/install-kubectl/#download-as-part-of-the-google-cloud-sdk

2. edit ```scripts/ENV.inc``` accordingly

3. create a cluster
```$ ./scripts/create_cluster.sh```

4. connect to cluster
```$ ./scripts/connect_cluster.sh```

5. create an headless service, to provide internal resolution for the cassandra nodes
$ ./scripts/create_headless_service.sh

6. create the stateful set of cassandra nodes
$ ./scripts/create_stateful_set.sh

7. wait until the nodes are all created and with status=Running
$ ./scripts/get_objects.sh

8. create the cassandra client app
$ ./scripts/create_client.sh

9. now wait until the nodes are all created and with status=Running
$ ./scripts/get_objects.sh

... we should now see something like:
```
NAME             TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE       SELECTOR        LABELS
svc/cassandra    ClusterIP   None          <none>        9042/TCP   25m       app=cassandra   app=cassandra
svc/kubernetes   ClusterIP   10.19.240.1   <none>        443/TCP    5d        <none>          component=apiserver,provider=kubernetes

NAME                  READY     STATUS    RESTARTS   AGE       IP            NODE                                         LABELS
po/cassandra-0        1/1       Running   0          24m       10.16.2.24    gke-cluster-one-default-pool-869adfa2-ddft   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-1        1/1       Running   0          23m       10.16.0.161   gke-cluster-one-default-pool-869adfa2-7m3c   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-2        1/1       Running   0          23m       10.16.0.162   gke-cluster-one-default-pool-869adfa2-7m3c   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-client   1/1       Running   0          8m        10.16.2.27    gke-cluster-one-default-pool-869adfa2-ddft   app=cassandra

NAME                     DESIRED   CURRENT   AGE       CONTAINERS   IMAGES                                LABELS
statefulsets/cassandra   3         3         24m       cassandra    gcr.io/google-samples/cassandra:v12   app=cassandra
```
10. check cassandra pods status:
$ ./scripts/nodetool_status.sh

... we should see something like:

Datacenter: DC1-K8Demo
======================
Status=Up/Down
|/ State=Normal/Leaving/Joining/Moving
--  Address      Load       Tokens       Owns (effective)  Host ID                               Rack
UN  10.16.0.161  71.04 KiB  32           100.0%            4ad4e1d3-f984-4f0c-a349-2008a40b7f0a  Rack1-K8Demo
UN  10.16.0.162  71.05 KiB  32           100.0%            fffca143-7ee8-4749-925d-7619f5ca0e79  Rack1-K8Demo
UN  10.16.2.24   71.03 KiB  32           100.0%            975a5394-45e4-4234-9a97-89c3b39baf3d  Rack1-K8Demo

11. so we can now connect to all the cassandra pods/instances directly with kubectl:

kubectl exec -it cassandra-0 -- cqlsh
kubectl exec -it cassandra-1 -- cqlsh
kubectl exec -it cassandra-2 -- cqlsh

12. we can also now connect to the client app
$ ./scripts/login_client.sh

root@cassandra-client:/opt/app# ls
app.js  insert_data.sh  node_modules  package.json  read_data.sh  setup_data.sh

13. and once in the client app we can:
	a) setup data - create keyspace and a table :
		root@cassandra-client:/opt/app# ./setup_data.sh
	b) insert_data - in the table
		root@cassandra-client:/opt/app# ./insert_data.sh
	b) read_data - from the table
		root@cassandra-client:/opt/app# ./read_data.sh

14. now once in the client app:
	a) add 2 more rows
	root@cassandra-client:/opt/app# ./insert_data.sh
	root@cassandra-client:/opt/app# ./insert_data.sh
	b) check rows in all the db replicas
	root@cassandra-client:/opt/app# ./read_data_all_dbs.sh
	...we should get something like:
		 id                                   | age | clubs_season | current_wages | goals_year | name     | nickames | properties
	--------------------------------------+-----+--------------+---------------+------------+----------+----------+--------------------------------------------------
	 b6d6f230-c0f5-11e7-98e0-e9450c2870ca |  26 |         null |          null |       null | jonathan |     null | {'goodlooking': 'yes', 'thinkshesthebest': 'no'}
	 5fd02b70-c0f8-11e7-8e29-3f611e0d5e94 |  26 |         null |          null |       null | jonathan |     null | {'goodlooking': 'yes', 'thinkshesthebest': 'no'}
	 5da86970-c0f8-11e7-8e29-3f611e0d5e94 |  26 |         null |          null |       null | jonathan |     null | {'goodlooking': 'yes', 'thinkshesthebest': 'no'}

	(3 rows)
	 id                                   | age | clubs_season | current_wages | goals_year | name     | nickames | properties
	--------------------------------------+-----+--------------+---------------+------------+----------+----------+--------------------------------------------------
	 b6d6f230-c0f5-11e7-98e0-e9450c2870ca |  26 |         null |          null |       null | jonathan |     null | {'goodlooking': 'yes', 'thinkshesthebest': 'no'}
	 5fd02b70-c0f8-11e7-8e29-3f611e0d5e94 |  26 |         null |          null |       null | jonathan |     null | {'goodlooking': 'yes', 'thinkshesthebest': 'no'}
	 5da86970-c0f8-11e7-8e29-3f611e0d5e94 |  26 |         null |          null |       null | jonathan |     null | {'goodlooking': 'yes', 'thinkshesthebest': 'no'}

	(3 rows)
	 id                                   | age | clubs_season | current_wages | goals_year | name     | nickames | properties
	--------------------------------------+-----+--------------+---------------+------------+----------+----------+--------------------------------------------------
	 b6d6f230-c0f5-11e7-98e0-e9450c2870ca |  26 |         null |          null |       null | jonathan |     null | {'goodlooking': 'yes', 'thinkshesthebest': 'no'}
	 5fd02b70-c0f8-11e7-8e29-3f611e0d5e94 |  26 |         null |          null |       null | jonathan |     null | {'goodlooking': 'yes', 'thinkshesthebest': 'no'}
	 5da86970-c0f8-11e7-8e29-3f611e0d5e94 |  26 |         null |          null |       null | jonathan |     null | {'goodlooking': 'yes', 'thinkshesthebest': 'no'}

	(3 rows)

15. so now lets delete a pod: 
$ ./scripts/delete_cassandra_pod.sh 
£££ delete pod cassandra-0...
pod "cassandra-0" deleted
£££ ... done.
running: kubectl get services,pods,deployments,sts -o wide --show-labels
NAME             TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE       SELECTOR        LABELS
svc/cassandra    ClusterIP   None          <none>        9042/TCP   44m       app=cassandra   app=cassandra
svc/kubernetes   ClusterIP   10.19.240.1   <none>        443/TCP    5d        <none>          component=apiserver,provider=kubernetes

NAME                  READY     STATUS        RESTARTS   AGE       IP            NODE                                         LABELS
po/cassandra-0        1/1       Terminating   0          43m       10.16.2.24    gke-cluster-one-default-pool-869adfa2-ddft   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-1        1/1       Running       0          42m       10.16.0.161   gke-cluster-one-default-pool-869adfa2-7m3c   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-2        1/1       Running       0          42m       10.16.0.162   gke-cluster-one-default-pool-869adfa2-7m3c   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-client   1/1       Running       0          27m       10.16.2.27    gke-cluster-one-default-pool-869adfa2-ddft   app=cassandra

NAME                     DESIRED   CURRENT   AGE       CONTAINERS   IMAGES                                LABELS
statefulsets/cassandra   3         3         43m       cassandra    gcr.io/google-samples/cassandra:v12   app=cassandra

16. wait until kubernetes provisions another pod to replace the deceased one:
$ ./scripts/get_objects.sh 
running: kubectl get services,pods,deployments,sts -o wide --show-labels
NAME             TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE       SELECTOR        LABELS
svc/cassandra    ClusterIP   None          <none>        9042/TCP   47m       app=cassandra   app=cassandra
svc/kubernetes   ClusterIP   10.19.240.1   <none>        443/TCP    5d        <none>          component=apiserver,provider=kubernetes

NAME                  READY     STATUS    RESTARTS   AGE       IP            NODE                                         LABELS
po/cassandra-0        1/1       Running   0          2m        10.16.2.28    gke-cluster-one-default-pool-869adfa2-ddft   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-1        1/1       Running   0          45m       10.16.0.161   gke-cluster-one-default-pool-869adfa2-7m3c   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-2        1/1       Running   0          45m       10.16.0.162   gke-cluster-one-default-pool-869adfa2-7m3c   app=cassandra,controller-revision-hash=cassandra-1097087426
po/cassandra-client   1/1       Running   0          30m       10.16.2.27    gke-cluster-one-default-pool-869adfa2-ddft   app=cassandra

NAME                     DESIRED   CURRENT   AGE       CONTAINERS   IMAGES                                LABELS
statefulsets/cassandra   3         3         45m       cassandra    gcr.io/google-samples/cassandra:v12   app=cassandra

17. back on the client app, lets check the replicas again:

 id                                   | age | clubs_season | current_wages | goals_year | name     | nickames | properties
--------------------------------------+-----+--------------+---------------+------------+----------+----------+--------------------------------------------------
 5fd02b70-c0f8-11e7-8e29-3f611e0d5e94 |  26 |         null |          null |       null | jonathan |     null | {'goodlooking': 'yes', 'thinkshesthebest': 'no'}
 5da86970-c0f8-11e7-8e29-3f611e0d5e94 |  26 |         null |          null |       null | jonathan |     null | {'goodlooking': 'yes', 'thinkshesthebest': 'no'}

(2 rows)










