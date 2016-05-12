var express = require('express');
var app = express();

var port = process.env.VCAP_APP_PORT || 8080
var host = process.env.VCAP_APP_HOST || 'localhost';


app.get('/', 
	function(req,res){
		
		res.status(200).send("oi");
		res.end();
	}
);


var server = app.listen(port, host, function () {
	
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
  console.log('OI');
});
