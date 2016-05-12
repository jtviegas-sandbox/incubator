
var Utils = (function() {

	var module = function(name){
		common.Mod.call(this,name);
	};

	module.prototype = Object.create(common.Mod.prototype);
	module.prototype.constructor = module;


	module.prototype.logger = (function(){
		var print = function(moduleName, message){
			console.log("[" + new Date().toUTCString() + " | " + moduleName + "]"  + message);
		};
		var enter  = function(moduleName, method){
			print(moduleName, "@" + method);
		};
		var leave  = function(moduleName, method){
			print(moduleName, method + "@");
		};
		var log = function(moduleName, msg){
			print(moduleName, msg);
		};
		
		return {
			enter: enter,
			leave: leave,
			log: log
		};

	})();


	module.prototype.readFileAsBase64 = function(file, callback){
		var reader = new FileReader();
		reader.onload = function(event){
			var data = event.target.result.replace("data:"+ file.type +";base64,", '');
			callback(data, file);
		};
		reader.readAsDataURL(file);
	};

	module.prototype.stopUiDefaultEvents = function(evt){

    	evt.stopPropagation();
		evt.preventDefault();

    };
    module.prototype.cookieManager = function(){

    	var getItem = function (sKey) {
		    if (!sKey) { return null; }
		    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
		  };

		var setItem= function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
		    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
		    var sExpires = "";
		    if (vEnd) {
		      switch (vEnd.constructor) {
		        case Number:
		          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
		          break;
		        case String:
		          sExpires = "; expires=" + vEnd;
		          break;
		        case Date:
		          sExpires = "; expires=" + vEnd.toUTCString();
		          break;
		      }
		    }
		    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
		    return true;
		  };

		  var removeItem = function (sKey, sPath, sDomain) {
		    if (!this.hasItem(sKey)) { return false; }
		    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
		    return true;
		  };
		  var hasItem = function (sKey) {
		    if (!sKey) { return false; }
		    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
		  };
		  var keys = function () {
		    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
		    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
		    return aKeys;
		  };

		  return {
		  	getItem: getItem, setItem: setItem, removeItem: removeItem,
		  	hasItem: hasItem, keys: keys
		  };

    }();


	return { module: module};

}());
