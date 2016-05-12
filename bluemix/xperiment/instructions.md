Get started with xperiment
-----------------------------------
Welcome to Java Web Starter application!

This sample application demonstrates how to write a Java Web application (powered by WebSphere Liberty) and deploy it on Bluemix.

1. [Install the cf command-line tool](https://www.ng.bluemix.net/docs/#starters/BuildingWeb.html#install_cf).
2. [Download the starter application package](https://ace.ng.bluemix.net:443/rest/../rest/apps/86be0d19-8986-4249-953a-3017a87bb6ca/starter-download).
3. Extract the package and `cd` to it.
4. Connect to Bluemix:

		cf api https://api.ng.bluemix.net

5. Log into Bluemix:

		cf login -u joaovieg@ie.ibm.com
		cf target -o joaovieg@ie.ibm.com -s dev
				
6. Compile the Java code and generate the war package using ant.
7. Deploy your app:

		cf push xperiment -p webStarterApp.war

8. Access your app: [http://xperiment.mybluemix.net](http://xperiment.mybluemix.net)
