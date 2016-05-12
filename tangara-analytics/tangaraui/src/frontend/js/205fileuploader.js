var FileUploader = (function(){

	var module = function(name){
		common.Mod.call(this,name);
		this.configMap.requires = ['utils', 'pubsub'];
	};

	module.prototype = Object.create(common.Mod.prototype);
	module.prototype.constructor = module;


	module.prototype.upload = function(stateMap, callback){


		
		
		var readerOnAbort = function(evt){
	    		logger.enter(mod.name, 'readerOnAbort');
	    		mod.setProgressRed("reader aborted");
	    		callback.nok(null);
				logger.leave(mod.name, 'readerOnAbort');
	    };

    	var listener = function(logger, mod, stateMap, callback){

    		var logger = logger;
	    	var mod = mod;
	    	var stateMap = stateMap;
	    	var callback = callback;

	    	/*
	    	on reader abort we want show an error message in the progress bar as red
	    	user can reset, load files again, or simply submit again
	    	*/
	    	var readerOnAbort = function(evt){
	    		logger.enter(mod.name, 'readerOnAbort');
	    		mod.setProgressRed("reader aborted");
	    		callback.nok(null);
				logger.leave(mod.name, 'readerOnAbort');
	    	};

	    	/*
	    	on reader error we want show an error message in the progress bar as red
	    	user can reset, load files again, or simply submit again
		    */
		    var readerOnError = function(evt){
		    	logger.enter(mod.name, 'readerOnError');
		    	mod.setProgressRed("reader exception: " + evt.type);
		    	callback.nok(null);
				logger.leave(mod.name, 'readerOnError');
		    };
		    /*
	    	on reader load success we want show a message in the progress bar as green
	    	user can reset, load files again, or simply submit again
		    */
		    var readerOnLoad = function(evt){
		    	logger.enter(mod.name, 'readerOnLoad');
		    	mod.setProgressGreen("uploading to server");
		    	var url = window.location.origin + '/analytics/io/csv';
			    $.ajax({
					async:true,
					url: url,
					data: evt.target.result,
					type: 'POST',
					success: function(){mod.setProgress(100); callback.ok(null);},
					dataType: 'text',
					error: function(){mod.setProgressRed("exception uploading to server");callback.nok(null);}
				});
				logger.leave(mod.name, 'readerOnLoad');
		    };

		    /*
	    	on reader load start we want show the bar as 1% and as orange 
	    	the message "uploading"
		    */
		    var readerOnLoadStart = function(evt){
		    	logger.enter(mod.name, 'readerOnLoad');
		    	mod.showProgress(true);
		    	mod.setProgress(1);
		    	mod.setProgressOrange("reading file");
				logger.leave(mod.name, 'readerOnLoad');
		    };
		     /*
	    	on reader load end we want show the bar as 50% of the 
	    	reader progress so far and as orange 
		    */
		    var readerOnLoadEnd = function(evt){
		    	logger.enter(mod.name, 'readerOnLoad');
		    	var p = 0 + (evt.loaded/evt.total)*0.5 * 100;
		    	mod.setProgress(p);
				logger.leave(mod.name, 'readerOnLoad');
		    };

		    /*
	    	on reader progress we want show the bar as 50% of the 
	    	reader progress so far and as orange 
		    */
		    var readerOnProgress = function(evt){
		    	logger.enter(mod.name, 'readerOnLoad');
		    	mod.showProgress(true);
		    	var p = 0 + (evt.loaded/evt.total)*0.5 * 100;
		    	mod.setProgress(p);
		    	mod.setProgressOrange("reading file");
				logger.leave(mod.name, 'readerOnLoad');
		    };

		    var listen = function(evt) {
				logger.enter(mod.name, 'listen');

		    	if(stateMap.file){
		    		mod.stopDefaultEvents(evt);
/*			    	evt.stopPropagation();
					evt.preventDefault();*/
					mod.showProgress(false);
					var reader = new FileReader();
					reader.onabort = readerOnAbort;
				  	reader.onerror = readerOnError;
				  	reader.onload = readerOnLoad;
				  	reader.onloadstart = readerOnLoadStart;
				  	reader.onloadend = readerOnLoadEnd;
				  	reader.onprogress = readerOnProgress;

				  	reader.readAsBinaryString(stateMap.file);
		    	}
		    	else
		    		callback.ok(null);
		    	
				logger.leave(this.name, 'listen');
		    };

		    return { listen: listen  };

    	}( this.configMap.modules['utils'].logger, this, stateMap, callback );


    	return listener;

    };
	

	return { module: module };

}());