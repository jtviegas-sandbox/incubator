var envlistener = function(){

	var util = require('util');
	var PragmaLogger = require('pragma-logger');
	var logger = new PragmaLogger({
	    logger: {
	      charset: 'utf8',
	      levels: {
	        debug: './logs/%pid_debug_%y-%m-%d-envlistener.log',
	        error: './logs/%pid_error_%y-%m-%d-envlistener.log',
	        warn: './logs/%pid_warn_%y-%m-%d-envlistener.log',
	        trace: './logs/%pid_trace_%y-%m-%d-envlistener.log',
	        info: './logs/%pid_info_%y-%m-%d-envlistener.log'
	      },
	      messageFormat: '%t \t| %name :: %lvl \t| PID: %pid - %msg'
	    }
	 }, 'envlistener');

	var variables = {};
	var listeners = [];
	var interfaceMethod = 'setEnv';

	var setVars2Listen = function(vars){
		logger.info(util.format('<IN> setVars2Listen[%s]', vars));
		//clean up;
		variables = {};
		for(i=0; i < vars.length; i++)
			variables[vars[i]] = null;

		logger.info('<OUT> setVars2Listen');		
	};

	var checkInterface = function(o) {
		logger.debug(util.format('<IN> checkInterface[%s]', o));

		var result = false;
		if(o.hasOwnProperty(interfaceMethod) && ( typeof o[interfaceMethod] == 'function' ) )
			result = true;

		logger.debug(util.format('<OUT> checkInterface[%s]', result));
		return result;	
	};

	var addListener = function(listener){
		logger.debug(util.format('<IN> addListener[%s]', listener));

		if( ! checkInterface(listener) )
			logger.error(util.format('this listener has no required interface method: %s', listener));
		else
			if(-1 == listeners.indexOf(listener))
				listeners.push(listener);

		logger.debug('<OUT> addListener');
	};

	var removeListener = function(listener){
		logger.debug(util.format('<IN> removeListener[%s]', listener));

		var index = listeners.indexOf(listener);
		if(-1 != index)
			listeners.splice(index, 1);

		logger.debug('<OUT> removeListener');
	};


	var broadcastChange = function(variable, value){
		logger.debug(util.format('<IN> broadcastChange[%s, %s]', variable, value));

		for( i=0; i < listeners.length; i++ )
			listeners[i].setEnv(variable, value);

		logger.debug('<OUT> broadcastChange');
	};

	var listen = function(){
		logger.debug('<IN> listen');

		for (var key in variables) {
			if (variables.hasOwnProperty(key)) {

				if(process.env[key]){
					var newval = process.env[key];
					if( ( null === variables[key] ) || ( newval != variables[key] ) ){
						variables[key] = newval;
						broadcastChange(key, newval);
					}
				}
				
			}
		}
		
		logger.debug('<OUT> listen');
	};

	return {
		setVars2Listen: setVars2Listen,
		addListener: addListener,
		removeListener: removeListener,
		listen: listen
	};

}();

module.exports = envlistener;