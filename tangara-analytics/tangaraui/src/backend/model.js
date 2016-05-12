//mongodb://username:password@hostname:port/database


var Model = (function(){

	var custom = require('./custom.js');
	var mongolib = require('mongodb');
	var ObjectID = mongolib.ObjectID
	var mongoClient = mongolib.MongoClient;
	var util = require('util');
	var assert = require('assert');
	var PragmaLogger = require('pragma-logger');
	var logger = new PragmaLogger({
	    logger: {
	      charset: 'utf8',
	      levels: {
	      	trace: './logs/%pid_trace_%y-%m-%d-model.log',
	        debug: './logs/%pid_debug_%y-%m-%d-model.log',
	        info: './logs/%pid_info_%y-%m-%d-model.log',
	        warn: './logs/%pid_warn_%y-%m-%d-model.log',
	        error: './logs/%pid_error_%y-%m-%d-model.log'
	      },
	      messageFormat: '%t \t| %name :: %lvl \t| PID: %pid - %msg'
	    }
	  }, 'model');

	var DB_CONNECT_STRING = 'mongodb://app:password@localhost:27017/tangara';

	if(process.env.DB_CONN_STR)
		DB_CONNECT_STRING = process.env.DB_CONN_STR;

	if(custom.areWeOnBluemix() && custom.doWeHaveServices()){
		DB_CONNECT_STRING = custom.getMongoConnectString();
		if(custom.areWeOnDocker()){
			logger.info('waiting for bluemix network to pop up...');
			custom.sleep(120000);
			logger.info('...resuming now');	
		}
	}

	logger.info('going to connect to db in: ' + DB_CONNECT_STRING);

	var dbcnx = (function(){
		logger.trace('@dbcnx');
		var connection = null;

		var callback = function(err, db){
			assert.equal(null, err);
			logger.info('connected to db !;-)');
			setConnection(db);
		};

		var setConnection = function(o){
			connection = o;
		};

		var get = function() {
			return connection;
		};
		
		var getCollection = function(collectionName){
			var collection = connection.collection(collectionName); 
			if(null == collection)
				collection = connection.createCollection(collectionName);

			return collection;
		};

		logger.trace('dbcnx@');
		
		return {
			get : get,
			getCollection: getCollection,
			callback: callback
		};
		
	}());

	mongoClient.connect(DB_CONNECT_STRING, dbcnx.callback);

	var post = function(collectionName, o, callback) {
		logger.trace('@Model.post [' + collectionName + ', ' + o.toString() + ']');

		var cbObj = function(cb, colName, objId){
			var _callback = cb;
			var _id = objId;

			var func = function(err,result){
				if (err) {
						logger.info('Model.post: post NOT successful on collection ' + colName +  
				  			' with id: ' + _id.toString() );
				  		logger.error(err);
				  		_callback.nok(err);
				  	}
				  	else {
				  		logger.info('Model.post: post successful on collection ' + colName +  
				  			' with id: ' + _id.toString() );
				  		_callback.ok(_id.toString());
				  	}
			};

			return {
				func:func
			};

		};


		if(o._id ) {
			o._id = new ObjectID(o._id);
			var cb = cbObj(callback, collectionName, o._id);
			logger.info('Model.post: going to replace id ' + o._id.toString() + ' on collection ' + collectionName ); 
			dbcnx.getCollection(collectionName).replaceOne(
				{'_id' : o._id}, o, cb.func );
		}
		else {			
			o._id = new ObjectID();
			var cb = cbObj(callback, collectionName, o._id);
			logger.info('Model.post: going to insert id ' + o._id.toString() + ' on collection ' + collectionName ); 
			dbcnx.getCollection(collectionName).insertOne(o, cb.func );
		}

		logger.trace('Model.post@');
	};

	var getAll  = function(collectionName, callback) {

		logger.trace('@Model.getAll [' + collectionName + ']');

		var cursor = dbcnx.getCollection(collectionName).find();
		var result = [];

		cursor.each(function(err, item) {
			if (err) {
				logger.info('Model.getAll: problems getting items from collection ' + collectionName);
	  			logger.error(err);
	  		}
	  		else{
	  			if (item != null) 
		    		result.push(item);
		    	else {
		    		logger.info('Model.getAll: got ' + result.length + ' items from collection ' + collectionName);
		    		callback.ok(result);
		    	}		    	
	  		}

	   	});
		

		logger.trace('Model.getAll@');
	};

	var get  = function(collectionName, id, callback) {
		logger.trace('@Model.get[ collection: ' + collectionName + ', id: ' + id  + ']');

		var cursor = dbcnx.getCollection(collectionName).find({'_id': new ObjectID(id)});
		cursor.each(function(err, item) {
			if (err) {
				logger.info('did not get item with id ' + item._id + ' from collection ' + collectionName);
	  			logger.error(err);
	  			callback.nok(null);
	  		}
	  		else {
	  			logger.debug('Model.get: got item with id ' + item._id 
	  				+ ' from collection ' + collectionName);
	  			callback.ok(item);
	  		}
	   	});
		logger.trace('Model.get@');
	};

	var del = function(collectionName, id, callback) {
		logger.trace('@Model.del[ collection: ' + collectionName + ', id: ' + id  + ']');

		dbcnx.getCollection(collectionName).deleteOne(
			{'_id': new ObjectID(id)},
			function(err,result){
				if (err) {
					logger.info('Model.del: did not remove item with id ' + id + ' from collection ' + collectionName);
	  				console.error(err);
	  				callback.nok(null);
	  			}
	  			else {
	  				logger.info('Model.del: removed item with id ' + id + ' from collection ' + collectionName);
	  				callback.ok(result);
	  			}
			}
		);
		logger.trace('Model.del@');		
	};

	return { 
		post: post
		,getAll: getAll
		,get: get
		,del: del
	}; 

}());

module.exports = Model;