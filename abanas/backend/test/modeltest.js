//mongodb://username:password@hostname:port/database

var Cloudant = require('cloudant');
var util = require('util');
var assert = require('assert');


	var DB_USR = null;
	var DB_PSWD = null;

	var requiredDatabases = [ 'items', 'categories' ];

	if (process.env.VCAP_SERVICES) {
		var services = JSON.parse(process.env.VCAP_SERVICES);
		var cloudant_info = services.cloudantNoSQLDB[0];
		DB_USR = cloudant_info.credentials.username;
		DB_PSWD = cloudant_info.credentials.password;
		
	}
	else {
		DB_USR = process.env.DB_USR;
		DB_PSWD = process.env.DB_PSWD;
	}

	var connectionOptions = {account:DB_USR, password:DB_PSWD};

	var cloudant = Cloudant(connectionOptions, function(err, cloudant, reply){
		if (err)
	    	throw err;
	    console.log('Connected with username: %s', reply.userCtx.name)
	});


	var createDbCallback = function(dbMap){

		for(dbName in dbMap){
			if(dbMap.hasOwnProperty(dbName))
				if(false == dbMap[dbName]){
					console.log("must create db %s", dbName);
					var creationCallback = function(name, map){

						var f = function(err, data){
							if(err)
								throw err;
							map[name] = true;
							console.log("created db %s", name);
						};
						return {f: f};
					};
					cloudant.db.create(dbName, creationCallback(dbName, dbMap).f);
				}
		}

	};

	var checkDatabases = function(requiredDatabases, createDbCallback) {

		var existentDbMap = {};

	    cloudant.db.list(function(err, data) {
	    	if(err)
	    		throw err;
	    	console.log("dbs in server: %s", data);
	    	if(data && 0<data.length)
	    		for(var i=0; i < data.length; i++)
	    			existentDbMap[data[i]] = true;

	    	for(var i=0; i<requiredDatabases.length; i++)
	    		if( ! existentDbMap[requiredDatabases[i]] )
	    			existentDbMap[requiredDatabases[i]]=false;
	    	
	    	console.log("dbs map: %s", JSON.stringify(existentDbMap));
	    	createDbCallback(existentDbMap);
	    	

	  	});
	};

	checkDatabases(requiredDatabases,createDbCallback);

/*	var db = cloudant.use(DB_NAME);
	db.insert({ _id: 'myid', crazy: true }, function(err, body) {
	  if (!err)
	    console.log(body);
		else
			console.log(err);
	})*/