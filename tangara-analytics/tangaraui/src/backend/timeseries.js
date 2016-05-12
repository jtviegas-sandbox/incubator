
/*var TimeSeries = function(){*/

	var TimeSeries = function() {
			this.timestamp = 0;
			this.resource = null;
			this.metric = null;
			this.value = 0.0;
	}

	// -------- static section

	//static fields
	TimeSeries.FIELDS = ['ts', 'resource', 'metric', 'value'];
	//static methods
	TimeSeries.validateObj = function(obj) {
		var result = true;
		for(var i = 0 ; i < TimeSeries.FIELDS.length ; i++ ){
			if(! obj.hasOwnProperty(TimeSeries.FIELDS[i]) ){
				result = false;
				break;
			}
		}
		return result;
	};

	TimeSeries.newInstance = function(ts,resource,metric,value){
		var instance = new TimeSeries();
		instance.set(ts,resource,metric,value);
		return instance;
	};

	TimeSeries.toObj = function(ts,resource,metric,value){
		return {
			timestamp: ts,
			resource: resource,
			metric: metric,
			value: value
		};
	};

	TimeSeries.array2Obj = function(vArray){
		return TimeSeries.toObj(vArray[0], vArray[1], vArray[2], vArray[3]);
	};

	TimeSeries.validateValues = function(vArray) {
		var result = true;

		if(vArray.length != 4)
			return false;

		if(isNaN(parseInt(vArray[0], 10)))
			return false;

		if(1 > vArray[1].length || 1 > vArray[2].length)
			return false;

		if(isNaN(parseFloat(vArray[3])))
			return false;

		return result;
	};

	TimeSeries.toString = function(obj){
		return '{ timestamp: ' + obj.timestamp + ' resource: ' + obj.resource + 
			' metric: ' + obj.metric + ' value: ' + obj.value + ' }';
	};

	// ---------------instance section
	TimeSeries.prototype.constructor = TimeSeries;

	TimeSeries.prototype.set = function(ts,resource,metric,value){
		this.timestamp = ts;
		this.resource = resource;
		this.metric = metric;
		this.value = value;
	};

	TimeSeries.prototype.toObj = function(){
		return TimeSeries.toObj(this.timestamp,
			this.resource, this.metric,this.value);
	};

	TimeSeries.prototype.toString = function(){
		return TimeSeries.toString(
			TimeSeries.toObj(this.timestamp,
			this.resource, this.metric,this.value)
		);
	};

/*	return new module();

}();*/

module.exports = TimeSeries;

