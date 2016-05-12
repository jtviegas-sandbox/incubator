loadModulesOld = function() {
		


		/* -------------------------------------------- */
		/* ---------- module one specific ---------- */
		/* -------------------------------------------- */
		var modOne_html = String() + ' <div class="mod" id="one"> '
				+ ' 	<div class="modHeader">' + ws.mod.name + '</div>'
				+ ' 	<div class="modBody"></div>' + ' </div>';
		// set up module header
		jqueryMap.$header.append(modOne_html);
		var modOne = jqueryMap.$header.find('.mod#one');
		var modOnePointers = {
				header : 	modOne.find('.modHeader'),
				body : 	modOne.find('.modBody')
			};
		jqueryMap.$modules[0] = modOnePointers;

		// configure and initialize feature modules
		ws.mod.configModule({});
		ws.mod.initModule(modOnePointers.body);
		
		modOnePointers.header.click(function(){
			changeAnchorPart({
				modOne : ($(this).next().is(':visible') ? 'closed' : 'open')
			});
			return false;
		});

		//update the config map
		configMap.anchor_schema_map.modOne= {
			open : true,
			closed : true
		};
	
		modOnePointers.body.css("display","none");
		/* -------------------------------------------- */
		
		/* -------------------------------------------- */
		/* ---------- module quotes specific ---------- */
		/* -------------------------------------------> */
		
		var modQuotes_html = String() + ' <div class="mod" id="quotes"> '
				+ ' 	<div class="modHeader">' + ws.quotes.name + '</div>'
				+ ' 	<div class="modBody"></div>' + ' </div>';
		// set up module header
		jqueryMap.$header.append(modQuotes_html);
		//set up module pointers
		var modQuotes = jqueryMap.$header.find('.mod#quotes');
		var modQuotesPointers = {
				header : 	modQuotes.find('.modHeader'),
				body : 	modQuotes.find('.modBody')
			};
		jqueryMap.$modules[1] = modQuotesPointers;

		//setup repository module
		ws.repository.configModule();
		ws.repository.initModule();
		
		//setup model module
		ws.model.configModule({ repository : ws.repository});
		ws.model.initModule();
		
		// configure and initialize quotes module
		// provide the model module to access data
		ws.quotes.configModule({ model: ws.model});
		ws.quotes.initModule(modQuotesPointers.body);
		
		// provide an event handler for module open/close
		// when header clicked
		modQuotesPointers.header.click(function(){
			changeAnchorPart({
				quotes : ($(this).next().is(':visible') ? 'closed' : 'open')
			});
			return false;
		});

		//update the config map
		configMap.anchor_schema_map.quotes= {
			open : true,
			closed : true
		};
	
		// close the quotes module by default
		modQuotesPointers.body.css("display","none");
		/* <------------------------------------------- */
		
	};

	changeAnchorPart = function(arg_map) {
		var anchor_map_revise = copyAnchorMap(), bool_return = true, key_name = null, key_name_dep;

		// Begin merge changes into anchor map
		KEYVAL: for (key_name in arg_map) {

			/*
			if (arg_map.hasOwnProperty(key_name)) {


				// skip dependent keys during iteration
				if (key_name.indexOf('_') === 0) {
					continue KEYVAL;
				}
			*/
				// update independent key value
				anchor_map_revise[key_name] = arg_map[key_name];
				/*
				// update matching dependent key
				key_name_dep = '_' + key_name;
				if (arg_map[key_name_dep]) {
					anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
				} else {
					delete anchor_map_revise[key_name_dep];
					delete anchor_map_revise['_s' + key_name_dep];
				}
				*/
			//}
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