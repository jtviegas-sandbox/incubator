var Console = (function(){

	var module = function(name){
		common.UIMod.call(this,name);
		this.active = false;
		this.configMap.events = ['onBody'];
		this.configMap.requires = [ 'utils', 'pubsub', 'consoleui', 
		'outcomeui'];
	};

	module.prototype = Object.create(common.UIMod.prototype);
	module.prototype.constructor = module;

	module.prototype.initModule = function($container){
		this.configMap.modules['pubsub'].subscribe(this.configMap.events, this);
		this.configMap.uicontainer = $container;
		this.initUi();
		this.setJqueryMap();
	};

	module.prototype.setJqueryMap = function(){
		this.stateMap.jqueryMap = {
			$container : this.configMap.uicontainer
			,$leftCol : $( this.configMap.uicontainer ).find('#leftCol')
			,$rightCol : $( this.configMap.uicontainer ).find('#rightCol')
		};
	};

	module.prototype.initUi = function(){

		var mainRow = document.createElement("div");
		$( this.configMap.uicontainer ).append(mainRow);
		mainRow.classList.add("row");

		var leftCol = document.createElement("div");
		mainRow.appendChild(leftCol);
		leftCol.classList.add("col-md-2");
		leftCol.setAttribute('id', 'leftCol');

		var rightCol = document.createElement("div");
		mainRow.appendChild(rightCol);
		rightCol.classList.add("col-md-10");
		rightCol.classList.add("container-fluid");
		rightCol.setAttribute('id', 'rightCol');
	};

	module.prototype.onEvent = function(event, data){
		this.configMap.modules['utils'].logger.enter(this.name, 'onEvent');

		if(event == "onBody" && null != data.body && data.body == "console"){
			this.stateMap.jqueryMap.$leftCol.empty();
			this.stateMap.jqueryMap.$rightCol.empty();
			this.configMap.modules['consoleui'].load(this.stateMap.jqueryMap.$leftCol, data.config);
			this.configMap.modules['outcomeui'].load(this.stateMap.jqueryMap.$rightCol, data.config);
		}
		
		this.configMap.modules['utils'].logger.leave(this.name, 'onEvent');
	};

	return { module: module };

}());