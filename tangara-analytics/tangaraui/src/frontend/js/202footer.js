var Footer = (function(){

	var module = function(name){
		common.UIMod.call(this,name);
	};

	module.prototype = Object.create(common.UIMod.prototype);
	module.prototype.constructor = module;

	module.prototype.setJqueryMap = function(){
		this.stateMap.jqueryMap = {
			$container : this.configMap.uicontainer
		};
	};

	module.prototype.initUi = function(){

		var div = document.createElement("div");
		$( this.configMap.uicontainer ).append(div);
		div.classList.add("inner");
		div.classList.add("pull-right");
		var p = document.createElement("p");
		div.appendChild(p);
		p.classList.add("text-muted");
		p.innerHTML = "&copy;2015 joao tiago viegas";

	};

	return { module: module };

}());