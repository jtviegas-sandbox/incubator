var ConsoleSink = function() {

	var NAME = 'ConsoleSink';
	//var TimeSeries = require('./timeseries.js');
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
	var TimeSeries = require('./timeseries');

	var execute = function (req, res, next) {

		logger.info('------------------------------- timeseries');
		for(var i=0 ; i < req.session.data.timeseries.length; i++){
				logger.info(TimeSeries.toString(req.session.data.timeseries[i]));
				process.emit('newData', { sessionId: req.session.id , data: req.session.data.timeseries[i] });
		}
		logger.info('------------------------------- bad entries');
		for(var i=0 ; i < req.session.data.badEntries.length; i++)
				logger.info(req.session.data.badEntries[i]);		

		next();
	};
	
	logger.info('loaded ' + NAME);

	return { execute: execute }; 
}();

module.exports = ConsoleSink;