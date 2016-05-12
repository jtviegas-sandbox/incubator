var Raw2TimeSeries = function() {

	var NAME = 'Raw2TimeSeries';
	var FIELDS = ['ts', 'resource', 'metric', 'value'];
	var PragmaLogger = require('pragma-logger');
	var util = require('util');
	var parse = require('csv-parse');
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
	var TimeSeries = require('./timeseries');

	/*
		we want to handle the incoming csv strings with the timeseries format.
		We must take into account that the csv values can be multiple with line separator
		included in the data body.
		We then assert that the values are right, somehow. 
	*/
	var execute = function (req, res, next) {
		logger.trace('@execute');
		var csvInput = req.body;

		var entry2Timeseries = function(tsMod){
			var tsModule = tsMod;
			var exec = function(vArr){
				var result = null;
				if(tsModule.validateValues(vArr)){
					result = tsModule.array2Obj(vArr);
				}
				return result;
			};
			return {exec: exec};
		}(TimeSeries);

		var callback = (function(processor, logger, converter, request){

			var exec = function(err, entries){
				var convertedEntries = 0;
				logger.info('entries:' + entries);

				if( null == err ) {
					for(var i = 0 ; i < entries.length; i++ ){
						var entry = entries[i];
						logger.info(util.format('found entry: %s', entry));
						var o = converter.exec(entry);

						if(null == o){
							logger.info(util.format('entry not converted!'));
							req.session.data.badEntries.push(entry);
						} else {
							logger.info(util.format('entry converted to: %s', o));
							req.session.data.timeseries.push(o);
							convertedEntries++;
						}
					}
				}

				if(err)
					next(err);
				else {
					if(1 > convertedEntries){
						next(new Error('[Raw2TimeSeries] no entries converted'));
					} else {
						processor();
					}
				}
				
				
			};

			return {exec: exec};
		})(next, logger, entry2Timeseries, req);

		parse(csvInput, {comment: '#'}, callback.exec );
		logger.trace('execute@');
	};
	
	logger.info('loaded ' + NAME);
	return { execute: execute }; 
}();

module.exports = Raw2TimeSeries;