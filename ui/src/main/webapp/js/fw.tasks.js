/*
 * spa.chat.js
 * Chat feature module for SPA
 */

/*jslint         browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */

/*global $, ws */

fw.tasks = (function() {
	// ---------------- BEGIN MODULE SCOPE VARIABLES --------------

	var settableMap = {
		html : null
	}, inputMap = {
		html : String()
				+ '<script id="taskListTemplate" type="text/x-jsrender">'
				+ '	<div class="container">'
				+ '		<div class="heading">'
				+ '			<div class="col col1">id</div>'
				+ '			<div class="col col2">name</div>'
				+ '			<div class="col col3">status</div>'
				+ '			<div class="col col4">start</div>'
				+ '			<div class="col col5">end</div>'
				+ '			<div class="col col6">host</div>'
				+ '		</div>'
				+ '		{^{for tasks}}' 
				+ '			<div class="table-row">'
				//+ '				<input type="hidden" data-link="id"/>'
				//+ '				<dt>{{:name}}</dt>' 
				//+ '				<dd>{{:status}}</dd>'
				+ '				<div class="col col1">{{:id}}</div>'
				+ '				<div class="col col2">{{:name}}</div>'
				+ '				<div class="col col3">{{:status}}</div>'
				+ '				<div class="col col4">{{:start}}</div>'
				+ '				<div class="col col5">{{:end}}</div>'
				+ '				<div class="col col6">{{:host}}</div>'
				+ '			</div>' 
				+ '		{{/for}}' 
				+ '	</div>'
				+ '</script>'
				+ '<div class="modBodyCenter">'
				+ '		<div class="taskTable" id="taskListPlaceholder">'
				+ '		</div>' 
				+ '</div>' 
				+ '<div class="modBodyFooter">'
				+ '		<a id="refreshAction">refresh</a>'
				//+ '		<a id="notesAction">notes</a>' 
				+ '</div>'
	}, configMap = {
		html : null,
		name : "tasks",
		jqueryMap : {
			container : null
		},
		task : {
			id : 0,
			name : null,
			status : null
		},
		tasks : null
	}, setJqueryMap, loadEvents, config, init, setupGetAllTasksEvent;

	// ----------------- END MODULE SCOPE VARIABLES ---------------

	// ------------------- BEGIN UTILITY METHODS ------------------
	// -------------------- END UTILITY METHODS -------------------

	// --------------------- BEGIN DOM METHODS --------------------
	// Begin DOM method /setJqueryMap/
	setJqueryMap = function(containerPointer) {
		configMap.jqueryMap = {
			container : containerPointer,
			refreshAction : containerPointer.find('#refreshAction'),
			//notesAction : containerPointer.find('#notesAction'),
			taskListTable : containerPointer.find('.taskTable'),
			taskListTemplate : $.templates("#taskListTemplate"),
			taskListPlaceholder : containerPointer.find('#taskListPlaceholder')
		};

	};

	loadEvents = function() {
		/*
		configMap.jqueryMap.notesAction.click(function() {
			console.log('going call notes');
			$.getJSON("http://xperiment.mybluemix.net/api/quotes/all",
					function(data) {
						console.log(data);
						console.log('@@@@@@');
					});
		});
		*/
		configMap.jqueryMap.refreshAction.click(function() {
			console.log('going call refresh');
			/*
			 * $.getJSON("https://co9143124022.kraklab.pl.ibm.com:52311/api/action/727/status?callback=?",
			 * function(data) { console.log(data); });
			 */
			$.getJSON("test.json", function(data) {

				var _tasks = new Array;
				$.each(data, function(key, val) {

					var task = new Object();
					task.id = val["Action ID"];
					task.name = val["Action Name"];
					task.status = val["Action Status"];
					var startUtc = val["Computers"][0]["Start Time"];
					var endUtc = val["Computers"][0]["End Time"];
					
					if(startUtc){
						var startLocal = new Date(0);
						startLocal.setUTCSeconds(startUtc);
						task.start = startLocal;
					}
					
					if(endUtc){
						var endLocal = new Date(0);
						endLocal.setUTCSeconds(endUtc);
						task.end = endLocal;
					}
					
					task.host = val["Computers"][0]["Computer Name"];
					
					_tasks.push(task);
				});
				var wrapper = new Array;
				wrapper.push(_tasks);
				$.gevent.publish('fw.tasks.getAll', wrapper);
			});
		});

		$.gevent.subscribe(configMap.jqueryMap.taskListTable,
				'fw.tasks.getAll', function(event, dataArr) {
					configMap.tasks = dataArr;
					configMap.jqueryMap.taskListTemplate.link(
							"#taskListPlaceholder", {
								tasks: configMap.tasks
							});
				});

	};

	// End DOM method /setJqueryMap/
	// ---------------------- END DOM METHODS ---------------------

	// ------------------- BEGIN EVENT HANDLERS -------------------
	// -------------------- END EVENT HANDLERS --------------------

	// ------------------- BEGIN PUBLIC METHODS -------------------
	// Begin public method /configModule/
	// Purpose : Adjust configuration of allowed keys
	// Arguments : A map of settable keys and values
	// * color_name - color to use
	// Settings :
	// * configMap.settable_map declares allowed keys
	// Returns : true
	// Throws : none
	//
	config = function(inputMapPointer) {
		fw.util.setConfigMap({
			inputMap : inputMap,
			settableMap : settableMap,
			configMap : configMap
		});
		return true;
	};

	init = function($container) {
		$container.append(configMap.html);
		setJqueryMap($container);
		loadEvents();
		return true;
	};
	// End public method /initModule/

	// return public methods
	return {
		config : config,
		init : init,
		name : configMap.name
	};
	// ------------------- END PUBLIC METHODS ---------------------
}());
