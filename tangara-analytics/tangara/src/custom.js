
var Custom = function() {

	var areWeOnDocker = function() {
		console.log('@areWeOnDocker');
		var result = false;
		if(process.env.DOCKER == 'true')
			result = true;

		console.log('areWeOnDocker@[' + result + ']')
		return result;
	};

	var areWeOnBluemix = function() {
		console.log('@areWeOnBluemix');
		var result = false;
		if(process.env.CONTEXT == 'bluemix')
			result = true;

		console.log('areWeOnBluemix@[' + result + ']')
		return result;
	};

	var doWeHaveServices = function() {
		console.log('@doWeHaveServices');
		var result = false;
		if(process.env.VCAP_SERVICES)
			result = true;

		console.log('doWeHaveServices@[' + result + ']')
		return result;
	};

	var getMongoConnectString = function() {
		console.log('@getMongoConnectString');
		var result = '';
		console.log('VCAP SERVICES: ' + JSON.stringify(process.env.VCAP_SERVICES, null, 4));
		var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
		for (var svcName in vcapServices) {
		    if (svcName.match(/^mongo.*/)) {
		      result = vcapServices[svcName][0].credentials.uri;
		      //result = result || vcapServices[svcName][0].credentials.url;
		      break;
		    }
		}
		console.log('getMongoConnectString@[' + result + ']')
		return result;
	};

	var sleep = function(milliseconds) {
	  var start = new Date().getTime();
	  while((new Date().getTime() - start) < milliseconds);
	};

	var log = function(msg){
		console.log('[' + new Date().toString() + '] ' + msg);
	};
	console.log('loaded custom');
	return { 
		areWeOnDocker: areWeOnDocker,
		areWeOnBluemix: areWeOnBluemix,
		getMongoConnectString: getMongoConnectString,
		doWeHaveServices: doWeHaveServices,
		sleep: sleep,
		log: log
	}; 

}();

module.exports = Custom;
