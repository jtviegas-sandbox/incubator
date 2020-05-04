
var PragmaLogger = require('pragma-logger');

var Custom = function() {
	
	var createLogger = function(name) {
		return new PragmaLogger({
		    logger: {
		      charset: 'utf8',
		      levels: {
		        debug: './logs/%pid_debug_%y-%m-%d-%name.log',
		        error: './logs/%pid_error_%y-%m-%d-%name.log',
		        warn: './logs/%pid_warn_%y-%m-%d-%name.log',
		        trace: './logs/%pid_trace_%y-%m-%d-%name.log',
		        info: './logs/%pid_info_%y-%m-%d-%name.log'
		      },
		      messageFormat: '%t \t| %name :: %lvl \t| PID: %pid - %msg'
		    }
		}, name );
	};


	var sleep = function(milliseconds) {
	  var start = new Date().getTime();
	  while((new Date().getTime() - start) < milliseconds);
	};

	var random = function(min, max) {
		var mi = 0;
		var ma = 1;
		if(min)
			mi=min;

		if(max)
			ma=max;

		return (Math.random() * (ma - mi)) + mi;
	};

	var randomString = function(len) {
		var o = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	    for( var i=0; i < 5; i++ )
	        o += possible.charAt(Math.floor(random() * possible.length));

	    return o;
	};

	var createDummyItem = function(shouldItBeRandom){
		var o = {
				_id: null,
				images:[
				//'','',''...... objectIDs
				],
				name: '',
				notes: '',
				price: '',
				category:'', // {name: '....'}
				subCategory: '' // {name: '....', category:'....'}
			};

		if(shouldItBeRandom){
			o.name = randomString(12);
			o.notes = randomString(24);
			o.price = random(3,6);
			o.category = randomString(12);
			o.subCategory = randomString(12);
		}

		return o;
	};

	var createDummyItem2 = function(shouldItBeRandom){
		var o = {
				images:[
				//'','',''...... objectIDs
				],
				name: '',
				notes: '',
				price: '',
				category:'', // {name: '....'}
				subCategory: '' // {name: '....', category:'....'}
			};

		if(shouldItBeRandom){
			o.name = randomString(12);
			o.notes = randomString(24);
			o.price = random(3,6);
			o.category = randomString(12);
			o.subCategory = randomString(12);
		}

		return o;
	};

	return { 
		sleep: sleep
		, createLogger: createLogger
		, createDummyItem: createDummyItem
		, createDummyItem2: createDummyItem2
		, randomString: randomString
		, random: random
	}; 

}();

module.exports = Custom;
