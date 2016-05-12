var TimeSeriesDbSink = function() {

	var NAME = 'TimeSeriesDbSink';
	var TimeSeries = require('./timeseries.js');
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

		if(0 < req.session.data.timeseries.length){

			var callback = function(d){
				var sessionData = d;
				var nok = function(err) {  logger.error(err); d.errors.push(err);};
				var ok = function(id) {
					logger.debug(util.format('inserted timeseries with id %s', id.toString()));
				};
				return { ok: ok, nok: nok };
			}(req.session.data);

			var topic = req.session.id ;
			for(var i = 0 ; i <  req.session.data.timeseries.length ; i++ ){
				var series = req.session.data.timeseries[i]; 
				logger.debug(series);
				model.post(topic, series, callback)
			}	
		}
		next();
		
		
		logger.trace('execute@');
		
	};
	
	logger.info('loaded ' + NAME);
	return { execute: execute }; 
}();

module.exports = TimeSeriesDbSink;