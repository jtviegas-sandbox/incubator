var OutcomeUi = (function(){

	var module = function(name){
		common.UIMod.call(this,name);
		this.configMap.events = ['sessionId'];
		this.configMap.requires = ['utils', 'pubsub' ];
		this.stateMap.lastTimestamp =  -1;
		this.stateMap.sessionId =  null;
	};

	module.prototype = Object.create(common.UIMod.prototype);
	module.prototype.constructor = module;
	
	module.prototype.initModule = function($container){
		this.configMap.modules['pubsub'].subscribe(this.configMap.events, this);
	};

	module.prototype.load = function(container, config){
		this.configMap.uicontainer = container;
		this.createWidgets(container);
		this.setJqueryMap();
		this.setEvents();
	};

	module.prototype.setJqueryMap = function(){
		this.stateMap.jqueryMap = {
			$container : this.configMap.uicontainer
		};
	};

	module.prototype.setSockets = function(){
		var socket = io.connect(window.location.origin + '/data/raw');
		var socketHandler = function(module, socket){
			var mod = module;
			var sock = socket;
			var exec = function(data){
				sock.emit('sessionId', mod.stateMap.sessionId);
				sock.on('newData', function(data){
					mod.configMap.modules['utils'].logger.log(mod.name, 'new data from server: ' +  JSON.stringify(data));
					mod.configMap.modules['pubsub'].publish('outcomeui.data',data);
				});
			};	

			return { exec: exec};

		}(this, socket);

		socket.on('connect', socketHandler.exec );

	};
	module.prototype.setEvents = function(){

		var sessionId = this.configMap.modules['utils'].cookieManager.getItem('sessionId');
		
		if(sessionId){
			this.configMap.modules['utils'].logger.log(this.name, 'found sessionId cookie in browser');
			this.stateMap.sessionId = sessionId;
			this.setSockets();
		}
		else
			this.configMap.modules['utils'].logger.log(this.name, 
				"no cookie in browser, we'll have to wait for notification of it before querying for data");

	};

	module.prototype.onEvent = function(event, data){
		this.configMap.modules['utils'].logger.enter(this.name, 'onEvent: ' + event);

		
		if(event == 'sessionId' && (null == this.stateMap.sessionId) ){
			this.configMap.modules['utils'].logger.log(this.name, 
			'so we have a sessionId event, this means we have submitted data,' +
			'  we now have an id to query data from the server');
			this.stateMap.sessionId =  data.sessionId;
			this.setSockets();
		}
		
		this.configMap.modules['utils'].logger.leave(this.name, 'onEvent: ' + event);
	};


	module.prototype.createWidgets = function(container){

		//setup file input
/*		var dropWgt = document.createElement("div");
		$( container ).append(dropWgt);
		dropWgt.setAttribute('id', 'dropWgt');
		dropWgt.setAttribute('style', "margin:10px; min-height:100px; border:1px dotted grey;");
		
		var dropWgtTitle = document.createElement("p");
		dropWgt.appendChild(dropWgtTitle);	
		dropWgtTitle.setAttribute('id', 'dropZoneTitle');	
		dropWgtTitle.innerHTML = this.stateMap.dragAndDropAreaTitle;

		var statusWgt = document.createElement("div");
		leftCol.appendChild(statusWgt);
		statusWgt.setAttribute('id', 'uploadStatus');
		statusWgt.setAttribute('style', "margin:10px; min-height:50px;");*/

	};

	return { module: module };

}());
