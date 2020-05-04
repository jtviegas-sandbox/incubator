//mongodb://username:password@hostname:port/database
var custom = require('./custom.js');
var Cloudant = require('cloudant');
var util = require('util');
var assert = require('assert');


var Model = (function(){

	var DB_USR = null;
	var DB_PSWD = null;
	var logger = custom.createLogger('model');

	var requiredDatabases = [ 'dev', 'items', 'categories' ];

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

	console.log("connectiong with user %s", DB_USR);
	var connectionOptions = {account:DB_USR, password:DB_PSWD};

	var cloudant = Cloudant(connectionOptions, function(err, cloudant, reply){
		if (err)
	    	throw err;
	    logger.info('Connected with username: %s', reply.userCtx.name)
	});


	var createDbCallback = function(dbMap){

		for(dbName in dbMap){
			if(dbMap.hasOwnProperty(dbName))
				if(false == dbMap[dbName]){
					logger.info("must create db %s", dbName);
					var creationCallback = function(name, map){

						var f = function(err, data){
							if(err)
								throw err;
							map[name] = true;
							logger.info("created db %s", name);
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
	    	logger.info("dbs in server: %s", data);
	    	if(data && 0<data.length)
	    		for(var i=0; i < data.length; i++)
	    			existentDbMap[data[i]] = true;

	    	for(var i=0; i<requiredDatabases.length; i++)
	    		if( ! existentDbMap[requiredDatabases[i]] )
	    			existentDbMap[requiredDatabases[i]]=false;
	    	
	    	logger.info("dbs map: %s", JSON.stringify(existentDbMap));
	    	createDbCallback(existentDbMap);
	    	

	  	});
	};

	checkDatabases(requiredDatabases,createDbCallback);

	var post = function(db, o, callback) {
		logger.trace('@Model.post');

		var dbObj = cloudant.use(db);

		var postCallback = function(err, body) {
			if(err)
				callback(err, null);
			else {
				callback(null, body);
			}

		};

		dbObj.insert(o, postCallback);

		logger.trace('Model.post@');
	};



	return { 
		post: post
	}; 




/*

	var getAll  = function(db, callback) {

		logger.trace('@Model.getAll');

		var getAllCallback = function(cback){
			var cb = cback;
			var f = function(err, collection){
				if(null != err){
					logger.trace(util.format('@getAll#getAllCallback err is not null %s', err));
					if(null != cb)
						cb(err, null);
				}
				else {
					logger.trace(util.format('@getAll#getAllCallback err is null'));
					var cursor = collection.find();
					var result = [];
					cursor.each(function(e, item) {
						if (null != e) {
				  			if(null != cb)
								cb(e, null);
						}
						else{
							if (item != null) 
					    		result.push(item);
					    	else {
					    		if(null != cb)
					    			cb(null,result);	
					    	}
						}			 
				   	});
				}

			};

			return { f: f };

		}(callback);
			
		cloudant.use(db);
		getCollection(collectionName, getAllCallback.f);

		logger.trace('Model.getAll@');
	};

	

	var delAll = function(collectionName, callback) {

		logger.trace('@Model.delAll');
		
		var delCallback = function(err, collection){
			if(null != err) {
				logger.trace(util.format('@delCallback...err is not null: %s.', err));
				if(null != callback)
					callback(err, null);
			}
			else {
				collection.deleteMany({}, null, function(e, r){
					if(null != e){
						logger.trace(util.format('@delCallback#collection.deleteMany...e is not null: %s.', e));
						if(null != callback)
							callback(e, null);
					}	
					else {
						logger.trace(util.format('@delCallback#collection.deleteMany...e is null and we have r: %s.', JSON.stringify(r)));
						logger.trace(typeof r)
						callback(null, JSON.parse(r));
					}
					
				});
				
			}
		};

		if(collectionMap[collectionName]){
			delCallback(null,collectionMap[collectionName]);
		}
		else 
			getCollection(collectionName, delCallback);
		
		logger.trace('Model.delAll@');		
	};




	var del = function(collectionName, id, callback) {

		logger.trace('@Model.del');

		var delCallback = function(err, col) {
			if(null != err) {
				logger.trace(util.format('@postCallback...err is not null: %s.', err));
				if(null != callback)
					callback(err, null);
			}
			else {
				var query = { _id: id};
				if("string" == typeof id)
					query._id =  new ObjectID(id);
				col.deleteOne(query , function(err, r){
					if(null != err) {
						if(null != callback)
							callback(err);
					}
					else {
						o = r.result;
						if( o.ok == 1 ){
						  	logger.info(util.format('deleted %d element(s) in collection %s', o.n, collectionName));
					  		if(null != callback)
								callback(err, o.n);
						}
					  	else {
					  		logger.info(util.format('result %d when deleting element in collection %s', o.ok, collectionName));
					  		if(null != callback)
					  			callback(new Error('delete was not ok'));
					  	}
					}
				} );
			}
		};

		if(collectionMap[collectionName]){
			delCallback(null,collectionMap[collectionName]);
		}
		else 
			getCollection(collectionName, delCallback);

		logger.trace('Model.del@');
	};

	var get = function(collectionName, id, callback) {

		logger.trace('@Model.get');

		var getCallback = function(err, col) {
			if(null != err) {
				logger.trace(util.format('@getCallback...err is not null: %s.', err));
				if(null != callback)
					callback(err, null);
			}
			else {
				var query = { _id: id};
				if("string" == typeof id)
					query._id =  new ObjectID(id);

				logger.trace(util.format('@getCallback...going to try to find id: %s which is type', id, typeof id));
				//logger.trace(util.format('@getCallback...col: %s', util.inspect(col)));
				col.findOne( query ,  function(err, r){
					if(null != err) {
						if(null != callback)
							callback(err);
					}
					else {
						if(null != r){
						  	logger.info(util.format('got %s element in collection %s', JSON.stringify(r), collectionName));
					  		if(null != callback)
								callback(null, r);
						}
					  	else {
					  		logger.info(util.format('no result when getting element in collection %s', collectionName));
					  		if(null != callback)
					  			callback(new Error('get was not ok'));
					  	}
					}
				} );
			}
		};

		if(null != collectionMap[collectionName]){
			getCallback(null,collectionMap[collectionName]);
		}
		else 
			getCollection(collectionName, getCallback);

		logger.trace('Model.get@');
	};*/

	

}());

module.exports = Model;

	