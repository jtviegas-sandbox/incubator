/*
 * spa.shell.js
 * Shell module for SPA
 */

/*jslint         browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */
/*global $, spa */

fw.shell = (function() {

	// ---------------- BEGIN MODULE SCOPE VARIABLES --------------
	
	var settableMap = {
		mainHtml : null,
		anchorSchemaMap : null,
		container : null,
		slideDelay : 0,
		// modules is an array of
		// { domPointers : null, object: null, descriptor: null } 
		modules : null
		
	},
	inputMap = {
		mainHtml : String() +  '<div class="fw-header page-end-section">' + '</div>' + 
		'<div class="fw-body"></div> <div class="fw-footer page-end-section"><img src="img/eyebeem.jpg"></div>',
		anchorSchemaMap : {},
		container : null,
		slideDelay : 800,
		modules : new Array()
	},
	configMap = {
		mainHtml : null,
		anchorSchemaMap : null,
		container : null,
		anchorMap : null,
		jqueryMap : {},
		slideDelay : 0,
		modules : null
	},
	
	// functions
	onHashchange,toggleModule,copyAnchorMap, changeAnchorPart, 
	onHashchange_modOne,
	loadModuleOne, loadModules, loadEvents,setJqueryMap,moduleLoader,
	config, init;

//---------------------------------------------------------------------------------
//---------------------  BEGIN PRIVATE METHODS           --------------------------
//---------------------------------------------------------------------------------

	onHashchange = function(event) {

		//get current anchor map
		var currentAnchorMap = copyAnchorMap(), 
			proposedAnchorMap; 
		
		// attempt to parse anchor
		try {
			proposedAnchorMap = $.uriAnchor.makeAnchorMap();
		} catch (error) {
			$.uriAnchor.setAnchor(currentAnchorMap, null, true);
			return false;
		}
		configMap.anchorMap = proposedAnchorMap;
		/*
		for (index in configMap.onHashChangeListeners) {
			configMap.onHashChangeListeners[index](configMap.modules[0], currentAnchorMap, proposedAnchorMap);
		}
		*/
		for ( index in configMap.modules) {
			var mod = configMap.modules[index];

			if(!proposedAnchorMap.hasOwnProperty(mod.descriptor)) {
				toggleModule(mod, 'closed');
			}
			else {
				var currentProperty = Object.getOwnPropertyDescriptor(currentAnchorMap, mod.descriptor);
				var proposedProperty = Object.getOwnPropertyDescriptor(proposedAnchorMap, mod.descriptor);

				if(!currentProperty || currentProperty.value !== proposedProperty.value){
					toggleModule(mod, proposedProperty.value);
				}
			}

		}
		

		return false;
	};

	toggleModule = function(mod, statusProposed) {
		var fn;
		if ( mod.domPointers.body.is(':visible') ){
			if(statusProposed == 'open') return true;
			fn= function(obj){
				obj.header.css("border-radius", "5px 5px 5px 5px");
				obj.body.css("z-index", "-1");
				
			};
		}
		else{
			if(statusProposed == 'closed') return true;
			mod.domPointers.body.css("z-index", "100");
			fn= function(obj){
				obj.header.css("border-radius", "5px 5px 0px 0px");
			};
			
		}

		mod.domPointers.body.slideToggle(configMap.slideDelay, fn(mod.domPointers));
		return true;
	};

	// Returns copy of stored anchor map; minimizes overhead
	copyAnchorMap = function() {
		return $.extend(true, {}, configMap.anchorMap);
	};

	changeAnchorPart = function(arg_map) {
		var anchor_map_revise = copyAnchorMap(), bool_return = true, key_name = null, key_name_dep;

		// Begin merge changes into anchor map
		KEYVAL: for (key_name in arg_map) {
				// update independent key value
				anchor_map_revise[key_name] = arg_map[key_name];
		}
		// End merge changes into anchor map

		// Begin attempt to update URI; revert if not successful
		try {
			$.uriAnchor.setAnchor(anchor_map_revise);
		} catch (error) {
			// replace URI with existing state
			$.uriAnchor.setAnchor(configMap.anchorSchemaMap, null, true);
			bool_return = false;
		}
		// End attempt to update URI...

		return bool_return;
	};

	loadModules = function() {
		// modules is an array of
		// { domPointers : null, object: null, descriptor: null }  
		for ( index in configMap.modules) {
			var mod = configMap.modules[index];
			

			var html = String() + ' <div class="module" id="' + index + '"> '
					+ ' 	<div class="moduleHeader">' + mod.object.name + '</div>'
					+ ' 	<div class="moduleBody"></div>' + ' </div>';
			// set up module header
			configMap.jqueryMap.body.append(html);
			var modAnchor = configMap.jqueryMap.body.find('.module#' + index);
			mod.domPointers = {
					header : 	modAnchor.find('.moduleHeader'),
					body : 	modAnchor.find('.moduleBody')
			};
			// configure and initialize module one
			mod.object.config({});
			mod.object.init(mod.domPointers.body);

			//add toggle event to module
			mod.domPointers.header.click(function(){	
				//if modOne body is visible then close it, otherwise open it
				var modDescriptor = 'mod' + $(this).parent().attr('id');
				var setValue = ($(this).next().is(':visible') ? 'closed' : 'open');
				var inputObj = {};
				Object.defineProperty(
					inputObj, 
					modDescriptor, {
				  		value: setValue,
				  		enumerable: true,
  						configurable: true,
  						writable: true
					}
				);
				changeAnchorPart(inputObj);
				return false;
			});

			//update the config map anchor schema
			Object.defineProperty(
				configMap.anchorSchemaMap, 
				mod.descriptor, 
					{
				  		value: { open : true, closed : true },
				  		enumerable: true,
  						configurable: true,
  						writable: true
					}
			);
		
			//set module closed by default
			mod.domPointers.body.css("display","none");
		}
	}

	loadEvents = function() {
		$(window).bind('hashchange', onHashchange).trigger('hashchange');		
	}

	setJqueryMap = function() {
		var $container = configMap.container;

		configMap.jqueryMap = {
			header : $container.find('.fw-header'),
			body : $container.find('.fw-body'),
			footer : $container.find('.fw-footer')
		};
	};

//---------------------------------------------------------------------------------
//---------------------  END PRIVATE METHODS           ----------------------------
//---------------------------------------------------------------------------------


//---------------------------------------------------------------------------------
//---------------------  BEGIN PUBLIC METHODS          ----------------------------
//---------------------------------------------------------------------------------

	config = function($container, $modulesArray) {

		var modules = new Array();

		$modulesArray.forEach(
			function(element, index, array){
				// modules is an array of
				// { domPointers : null, object: null, descriptor: null } 
				modules[index] = {
					domPointers: null,
					object: element,
					descriptor: 'mod' + index
				};
			}
		);
		inputMap.container = $container;
		inputMap.modules = modules;
		

		fw.util.setConfigMap({
      		inputMap    : inputMap,
      		settableMap : settableMap,
      		configMap   : configMap
    	});
		// configure uriAnchor to use our schema
		$.uriAnchor.configModule({
			schema_map : configMap.anchorSchemaMap
		});
	};

	init = function($container) {
		// load HTML and map jQuery collections
		configMap.container.html(configMap.mainHtml);
		setJqueryMap();
		loadModules();
		loadEvents();
	};
	
//---------------------------------------------------------------------------------
//---------------------  END PUBLIC METHODS          ------------------------------
//---------------------------------------------------------------------------------
	


	return {
		init : init,
		config: config
	};

}());
