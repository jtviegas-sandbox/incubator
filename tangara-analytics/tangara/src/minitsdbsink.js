var MiniTsDbSink = function() {

	var NAME = 'MiniTsDbSink';
	var PragmaLogger = require('pragma-logger');
	
	var logger = new PragmaLogger({
	    logger: {
	      charset: 'utf8',
	      levels: {
	        debug: './logs/%pid_debug_%y-%m-%d-' + NAME +'.log',
	        error: './logs/%pid_error_%y-%m-%d-' + NAME +'.log',
	        warn: './logs/%pid_warn_%y-%m-%d-' + NAME +'.log',
	        trace: './logs/%pid_trace_%y-%m-%d-' + NAME +'.log',
	        info: './logs/%pid_info_%y-%m-%d-' + NAME +'.log'
	      },
	      messageFormat: '%t \t| %name :: %lvl \t| PID: %pid - %msg'
	    }
	  }, NAME);
	var util = require('util');
	var model = require('./model');

	var execute = function (req, res, next) {
		logger.trace('@execute');

		logger.info('request POST session id is: ' + req.session.id);
		logger.info('request POST input is: ' + req.session.data);
		if(req.session.data) {
			var input = req.session.data;

			if(0 < input.data){

				var callback = function(d){
					var sessionData = d;
					var nok = function(err) {  logger.error(err); d.errors.push(err);};
					var ok = function(id) {
						logger.info(util.format('inserted minits with id %s', id.toString() ));
					};
					return { ok: ok, nok: nok };
				}(input);

				var topic = req.session.id ;
				for(var i = 0 ; i <  input.data.length ; i++ ){
					var series = input.data[i]; 
					logger.debug(series);
					model.post(topic, series, callback)
				}	
			}

		}
		next();
		logger.trace('execute@');
	};
	
	logger.info('loaded ' + NAME);
	return { execute: execute }; 
}();

module.exports = MiniTsDbSink;