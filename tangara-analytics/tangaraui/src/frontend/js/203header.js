var Header = (function(){

	var module = function(name){
		common.UIMod.call(this,name);
		//this.configMap.events = ['onBody'];
		//this.configMap.requires = ['utils', 'pubsub'];
		this.stateMap.anchor_map = {};
		this.stateMap.jqueryMap = {}; 
/*		this.stateMap.gui = null;*/
		
	};

	module.prototype = Object.create(common.UIMod.prototype);
	module.prototype.constructor = module;
	
	module.prototype.setJqueryMap = function(){

		this.stateMap.jqueryMap = {
			$container : this.configMap.uicontainer
		};

	};

	module.prototype.initUi = function(){
		//we are receiving a div element with id header
		var div1 = document.createElement("div");
		$( this.configMap.uicontainer ).append(div1);
		div1.classList.add("masthead");
		div1.classList.add("clearfix");
		var div2 = document.createElement("div");
		div1.appendChild(div2);
		div2.classList.add("inner");
		var h3 = document.createElement("h3");
		div2.appendChild(h3);
		h3.classList.add("masthead-brand");
		h3.innerHTML='tangara';

	};


	return { module: module };

}());