var ConsoleUi = (function(){

	var module = function(name){
		common.UIMod.call(this,name);
		this.configMap.events = ['consoleui.resetState', 'consoleui.fileTypeNotAllowed', 
			'consoleui.uploadFile', 'consoleui.uploadStart', 'consoleui.uploadFailed', 
			'consoleui.uploadDone', 'consoleui.resumeRead'];
		this.configMap.requires = ['utils', 'pubsub' ];
		this.stateMap.file = null;
		this.stateMap.throbber =  null;
		this.stateMap.reader =  null;
		this.stateMap.sessionId =  null;
		this.stateMap.readOffset =  128;
		this.stateMap.bytesReadSoFar =  0;
		this.stateMap.dragAndDropAreaTitle = 'Drag & drop your file here...';
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

	module.prototype.getThrobber = function(){
		if(null == this.stateMap.throbber)
			this.stateMap.throbber = Throbber(20);

		return this.stateMap.throbber;
	};

	module.prototype.getReader = function(){
		if(null == this.stateMap.reader)
			this.stateMap.reader = new FileReader();

		return this.stateMap.reader;
	};

	module.prototype.setJqueryMap = function(){
		this.stateMap.jqueryMap = {
			$container : this.configMap.uicontainer
			,$dropZone: $( this.configMap.uicontainer ).find('#dropWgt')[0]
			,$uploadStatus: $( this.configMap.uicontainer ).find('#uploadStatus')[0]
			,$dropZoneTitle: $( this.configMap.uicontainer ).find('#dropZoneTitle')[0]
			
		};
	};

	module.prototype.setEvents = function(){

		var dropFileUiAction = function(module) {
			var mod = module;
			var exec = function(evt){
				mod.configMap.modules['utils'].stopUiDefaultEvents(evt);
				var dt = evt.originalEvent.dataTransfer;
				if(dt.files){
					mod.configMap.modules['pubsub'].publish('consoleui.resetState',null);
					var f = dt.files[0];
					var fileType = /text.*/;
					if (!fileType.test(f.type)) 
						mod.configMap.modules['pubsub'].publish('consoleui.fileTypeNotAllowed',{type: f.type});
					else {
						mod.stateMap.file = f;
						mod.configMap.modules['pubsub'].publish('consoleui.uploadFile',null);
					}
				}
			};
			return {exec: exec};
		
		}(this);

		$( this.stateMap.jqueryMap.$dropZone ).on('dragenter',this.configMap.modules['utils'].stopUiDefaultEvents);
		$( this.stateMap.jqueryMap.$dropZone ).on('dragover',this.configMap.modules['utils'].stopUiDefaultEvents);
		$( this.stateMap.jqueryMap.$dropZone ).on('drop',dropFileUiAction.exec);

	};

	module.prototype.setUiStateReset = function() {
		this.stateMap.file = null;
		this.getThrobber().stop();
		this.stateMap.bytesReadSoFar = 0;
		$(this.stateMap.jqueryMap.$dropZoneTitle).html(this.stateMap.dragAndDropAreaTitle);
		$( this.stateMap.jqueryMap.$uploadStatus ).empty();
	};
	module.prototype.setUiStateFileTypeNotAllowed = function(data) {
		this.stateMap.file = null;
		$(this.stateMap.jqueryMap.$dropZoneTitle).html('file type not allowed: ' + data.type);
	};

	module.prototype.uploadFileAction = function(startB) {
		this.configMap.modules['utils'].logger.enter(this.name, 'uploadFileAction: ' + startB );
		var startByte = startB;
		if(0 == startByte)
			this.configMap.modules['pubsub'].publish('consoleui.uploadStart', {fileName: this.stateMap.file.name});


		var lastChunk = false;

		var endByte = startByte + this.stateMap.readOffset;
		if(endByte > this.stateMap.file.size){
			endByte = this.stateMap.file.size;
			lastChunk = true;
		}

		//we want to know if there were errors, if so we cancel all the process
		var fail = function(module){
			var mod = module;
			var exec = function(o){
				mod.configMap.modules['pubsub'].publish('consoleui.uploadFailed',{fileName: mod.stateMap.file.name});
				console.log(o);
			};
			return { exec: exec};
		}(this);
		this.getReader().onabort = fail.exec;
		this.getReader().onerror = fail.exec;

		//lets handle the reading success
		var done = null;
		//we have always to upload the chunks
		//what changes is if we are reading the last chunk or not
		if(lastChunk){
			done = function(module){
				var mod = module;
				var exec = function(o){
					mod.configMap.modules['pubsub'].publish('consoleui.uploadDone',{fileName: mod.stateMap.file.name});
					//with the completion of the datat submisssion, we should now received a sessionId
					//we need it for we will query the data with this id
					mod.stateMap.sessionId = o.sessionId;
					//is the browser already informed about this sessionId?
					if( ! mod.configMap.modules['utils'].cookieManager.getItem('sessionId') ){
						mod.configMap.modules['utils'].cookieManager.setItem('sessionId', o.sessionId);
						//so this is a new sessionId,  let everyone know about this
						mod.configMap.modules['pubsub'].publish('sessionId',{sessionId: o.sessionId});
					}
				};
				return { exec: exec};
			}(this);
		}
		else {
			done = function(module){
				var mod = module;
				var sByte = 0;
				var setStartByte = function(sB) {
					sByte = sB;
				};
				var exec = function(o){
					mod.configMap.modules['pubsub'].publish('consoleui.resumeRead',{startByte: sByte});
					console.log(o);
				};
				return { exec: exec,
					setStartByte: setStartByte};
			}(this);
		}

		var doneRead = function(module, success, failed){
			var mod = module;
			var s = success, f = failed;
			var exec = function(o){

				var length2read = o.target.result.length; 
				var eol = -1;
				var nextByte2Read = length2read;
				var rawRead = o.target.result;
				var newLine = null;

				eol = rawRead.lastIndexOf('\r\n');
				if(-1 < eol){
					newLine = '\r\n';
					length2read = eol;
					nextByte2Read = length2read + 2;
				}
				else {
					eol = rawRead.lastIndexOf('\n');
					if(-1 < eol){
						newLine = '\n';
						length2read = eol;
						nextByte2Read = length2read + 1;
					}
					
				}
				var bytesBeingRead = nextByte2Read;
				nextByte2Read += mod.stateMap.bytesReadSoFar;
				mod.stateMap.bytesReadSoFar += bytesBeingRead;
				var reading2send = rawRead.substring(0, length2read);

				if(mod.stateMap.bytesReadSoFar < mod.stateMap.file.size)
					s.setStartByte(nextByte2Read);

				var url = window.location.origin + '/analytics/io/csv';
				$.ajax({
					async:true,
					url: url,
					data: {csv:reading2send},
					type: 'POST',
					//contentType: "multipart/form-data",
					//processData: false,
					dataType: 'json'
				}).done(s.exec).fail(f.exec);

			};
			return { exec: exec};
		}(this, done, fail);
		this.getReader().onload = doneRead.exec;
		var blob = this.stateMap.file.slice(startByte, endByte);
		this.getReader().readAsBinaryString(blob);
		this.configMap.modules['utils'].logger.leave(this.name, 'uploadFileAction: ' + startB );
	};


	module.prototype.setUiStateUploadStart = function(data) {
		
		$(this.stateMap.jqueryMap.$dropZoneTitle).html('uploading: ' + data.fileName );
		this.getThrobber().appendTo( this.stateMap.jqueryMap.$uploadStatus ).start();
	};
	module.prototype.setUiStateUploadFailed = function(data) {
		this.stateMap.bytesReadSoFar = 0;
		$(this.stateMap.jqueryMap.$dropZoneTitle).html('failed uploading: ' + data.fileName );
		this.getThrobber().stop();
	};
	module.prototype.setUiStateUploadDone = function(data) {
		this.stateMap.bytesReadSoFar = 0;
		$(this.stateMap.jqueryMap.$dropZoneTitle).html('successfully uploaded: ' + data.fileName );
		this.getThrobber().stop();
	};

	module.prototype.onEvent = function(event, data){
		this.configMap.modules['utils'].logger.enter(this.name, 'onEvent: ' + event);

		if(event == 'consoleui.resetState')
			this.setUiStateReset();
		else if (event == 'consoleui.fileTypeNotAllowed')
			this.setUiStateFileTypeNotAllowed(data);
		else if (event == 'consoleui.uploadFile')
			this.uploadFileAction(0);
		else if (event == 'consoleui.uploadStart')
			this.setUiStateUploadStart(data);
		else if (event == 'consoleui.uploadFailed')
			this.setUiStateUploadFailed(data);
		else if (event == 'consoleui.uploadDone')
			this.setUiStateUploadDone(data);
		else if (event == 'consoleui.resumeRead')
			this.uploadFileAction(data.startByte);


		this.configMap.modules['utils'].logger.leave(this.name, 'onEvent: ' + event);
	};


	module.prototype.createWidgets = function(container){

		//setup file input
		var dropWgt = document.createElement("div");
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
		statusWgt.setAttribute('style', "margin:10px; min-height:50px;");
	};

	return { module: module };

}());
