var util = require('util');
var PragmaLogger = require('pragma-logger');
var logger = new PragmaLogger({
	    logger: {
	      charset: 'utf8',
	      levels: {
	        debug: './logs/%pid_debug_%y-%m-%d-app.log',
	        error: './logs/%pid_error_%y-%m-%d-app.log',
	        warn: './logs/%pid_warn_%y-%m-%d-app.log',
	        trace: './logs/%pid_trace_%y-%m-%d-app.log',
	        info: './logs/%pid_info_%y-%m-%d-app.log'
	      },
	      messageFormat: '%t \t| %name :: %lvl \t| PID: %pid - %msg'
	    }
	 }, 'app');
var http = require("http");
var quotes = require("./quotes.js");
var poster = require("./poster.js");
var envlistener = require("./envlistener.js");

poster.setOptions({ contentType: 'application/json' });
envlistener.setVars2Listen(['POST_HOST', 'POST_PORT', 'POST_PATH']);
envlistener.addListener(poster);

//set 1m interval
var interval = 1000 * 20;
var symbols = ["YHOO","AAPL","GOOG","MSFT"];

setInterval(envlistener.listen, interval);

var quotesRetriever = function(callback, symbols){
	var call = function(){
		logger.info('going to get quotes');
		quotes.getLastQuote(symbols, callback);
		logger.info('just asked for quotes');
	};
	return {
		call: call
	};
}(poster.post, symbols);


setInterval(quotesRetriever.call, interval);
