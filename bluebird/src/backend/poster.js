var poster = function(){

	var util = require('util');
	var PragmaLogger = require('pragma-logger');
	var logger = new PragmaLogger({
	    logger: {
	      charset: 'utf8',
	      levels: {
	        debug: './logs/%pid_debug_%y-%m-%d-poster.log',
	        error: './logs/%pid_error_%y-%m-%d-poster.log',
	        warn: './logs/%pid_warn_%y-%m-%d-poster.log',
	        trace: './logs/%pid_trace_%y-%m-%d-poster.log',
	        info: './logs/%pid_info_%y-%m-%d-poster.log'
	      },
	      messageFormat: '%t \t| %name :: %lvl \t| PID: %pid - %msg'
	    }
	 }, 'poster');
	var http = require("http");

	//var contentType = 'application/json';
	var host = null, port = null, path = null, contentType = null;

	var setOptions = function(options){
		logger.info(util.format('<IN> setOptions[%s]', options));

		if(options.host)
			host = options.host;

		if(options.port)
			port = options.port;

		if(options.path)
			path = options.path;

		if(options.contentType)
			contentType = options.contentType;

		logger.info('<OUT> setOptions');		
	};

	var setEnv = function(variable, value){
		
		if(variable == 'POST_HOST')
			host = value;

		if(variable == 'POST_PORT')
			port = value;

		if(variable == 'POST_PATH')
			path = value;

	};

	var post = function(data){
		logger.info(util.format('<IN> post[%s]', data));

		if( null === contentType || null === path || null === port || null === path )
			logger.warn("must set options before posting data ! ... aborting.");
		else {
			var postData = {};
			postData.data = data;
			var asString = JSON.stringify(postData);

			logger.info('posting data: ' + asString);

			logger.info('going to post to: ' + process.env.POST_HOST);
			var options = {
			  'host': host,
			  'port': port,
			  'path': path,
			  'method': 'POST',
			  'headers': {
			    'Content-Type': contentType,
			    'Content-Length': asString.length
			  }
			};
			var req = http.request(options, 
				function(res) {
					logger.info('POST RESPONSE STATUS: ' + res.statusCode);
				}
			);

			req.on('error', function(e) {
			  logger.error('problem with request: ' + e.message);
			});
			req.write(asString);
			req.end();
		}
		
		logger.info('<OUT> post');
	};

	return {
		setOptions: setOptions,
		post: post,
		setEnv: setEnv
	};

}();


module.exports = poster;