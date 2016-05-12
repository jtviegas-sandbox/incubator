/*
*	quotes module
*/
var quotes = function(){

	var util = require('util');
	var PragmaLogger = require('pragma-logger');
	var logger = new PragmaLogger({
	    logger: {
	      charset: 'utf8',
	      levels: {
	        debug: './logs/%pid_debug_%y-%m-%d-quotes.log',
	        error: './logs/%pid_error_%y-%m-%d-quotes.log',
	        warn: './logs/%pid_warn_%y-%m-%d-quotes.log',
	        trace: './logs/%pid_trace_%y-%m-%d-quotes.log',
	        info: './logs/%pid_info_%y-%m-%d-quotes.log'
	      },
	      messageFormat: '%t \t| %name :: %lvl \t| PID: %pid - %msg'
	    }
	 }, 'quotes');
	var urlenc = require('urlencode');
	var http = require("http");

	/*{
		'ts': null,
		'symbol': null,
		'quote' : null,
		'volume': null
	}*/

	var createUriPath = function(symbol){
		logger.info(util.format('<IN> createUriPath[%s]', symbol));
		var symbolClause = null;
		if(util.isArray(symbol)){
			symbolClause = '"' + symbol.join('","') + '"';
		}
		else
			symbolClause = '"' + symbol + '"';

		var yql = util.format('select * from yahoo.finance.quote where symbol in (%s)', symbolClause);
		var result = '/v1/public/yql?q=' + urlenc(yql) +  '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
		logger.info(util.format('<OUT> createUriPath[%s]', result));
		return result;
	};

	var toCustomQuote = function(o, ts){
		logger.info(util.format('<IN> toCustomQuote[%s, %s]', o, ts));
		var result = {};
		result.ts = new Date(ts).getTime();
		result.symbol = o.symbol;
		result.quote = parseFloat(o.LastTradePriceOnly);
		result.volume = parseInt(o.Volume);
		logger.info(util.format('<OUT> toCustomQuote[%s]', result));
		return result;
	};

	var getLastQuote = function(symbol, callback) {

		logger.info(util.format('<IN> getLastQuote[%s]', symbol));
		var uriPath = createUriPath(symbol);
		var buff = null;
		http.get(
			{
			  hostname: 'query.yahooapis.com',
			  port: 80,
			  path: uriPath,
			  agent: false  // create a new agent just for this one request
			}, 
			function (res) {
				res.on('data', function (chunk) {
					var newData = new Buffer(chunk);
					if(null !== buff)
						buff = Buffer.concat([buff, newData], buff.length + newData.length);
					else
						buff = newData;
				    
				 })
				.on('end', function(){
					
					var outcome = JSON.parse(buff.toString());
					var result = [];

					if(outcome.query.results){
						var ts = outcome.query.created;
						if(util.isArray(outcome.query.results.quote)){
							var arr = outcome.query.results.quote;
							for ( i=0; i < arr.length; i++ ){
								var q = arr[i];
								if(null !== q.StockExchange){
									result.push(toCustomQuote(q, ts));
								}
							}	
						}
						else {
							if(null !== outcome.query.results.quote.StockExchange){
								result.push(toCustomQuote(outcome.query.results.quote, ts));
							}
						}
					}
					else
						logger.info('got no results');

					callback(result);

				});
			}
		).on('error', 
			function(e) {
  				logger.error("Got error: " + e.message);
			}	
		);		
		logger.info('<OUT> getLastQuote');
	};

	return {
		getLastQuote: getLastQuote
	};

}();

module.exports = quotes;