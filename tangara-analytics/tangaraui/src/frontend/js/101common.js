
var common = (function() {

	
	var Mod = function(name){
		this.name = name;
		this.active = true;
		this.configMap = {
			//requires: ['api'];
			requires: [],
			events: ['onAnchor'],
			modules: {}
		}; 
		this.stateMap = {
			anchor_map : {}	
		}; 
	};

	Mod.prototype.getName = function(){
		return this.name;
	};
	Mod.prototype.isActive = function(){
		return this.active;
	};
	Mod.prototype.setActive = function(value){
		this.active = value;
	};
	Mod.prototype.onEvent = function(event, data){
		console.log("Mod.prototype.onEvent not implemented");
	};
	Mod.prototype.setEvents = function(){
		console.log("Mod.prototype.setEvents not implemented");
	};
	Mod.prototype.initModule = function($container){
		
		if(null != this.configMap.events){
			if(this.configMap.modules.hasOwnProperty('pubsub')){
				var pubsub = this.configMap.modules['pubsub'];
				pubsub.subscribe(this.configMap.events, this);
			}
		} 
		

	};
	Mod.prototype.requires = function(dependency){
		var result = false;
		if(Array.isArray(this.configMap.requires)){
			for( var i = 0 ; i < this.configMap.requires.length ; i++ ){
				var req = this.configMap.requires[i];
				if( req == dependency){
					result = true;
					break;
				}
			}
		}
		return result;
	};

	var UIMod = function(name){
		Mod.call(this,name);
		this.configMap.uicontainer = null;
		this.configMap.main_html = null;
		this.stateMap.jqueryMap = {} ;

	};

	UIMod.prototype = Object.create(Mod.prototype);
	UIMod.prototype.constructor = UIMod;

	UIMod.prototype.setJqueryMap = function(){
		console.log("UIMod.prototype.setJqueryMap not implemented");
	};

	UIMod.prototype.initUi = function(){
		console.log("UIMod.prototype.initUi not implemented");
	};

	UIMod.prototype.initModule = function($container){
		
		if(null != this.configMap.events){
			if(this.configMap.modules.hasOwnProperty('pubsub')){
				var pubsub = this.configMap.modules['pubsub'];
				pubsub.subscribe(this.configMap.events, this);
			}
		}

		this.configMap.uicontainer = $container;
		if(this.configMap.main_html)
			this.configMap.uicontainer.html(this.configMap.main_html);
		this.initUi();
		this.setJqueryMap();
		this.setEvents();
	};

	return { Mod: Mod,
		UIMod: UIMod };

}());
