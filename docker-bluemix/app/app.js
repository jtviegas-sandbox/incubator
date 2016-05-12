const proc = require('child_process');


var express = require('express');
var app = express();

var port = process.env.VCAP_APP_PORT || 8080
var host = process.env.VCAP_APP_HOST || 'localhost';

app.get('/', 
	function(req,res){
		var buf1 = proc.execSync('cat /etc/hosts');
		var buf2 = proc.execSync('ifconfig');
		var bLen = buf1.length + buf2.length;

		const bufA = Buffer.concat([buf1, buf2], bLen);

		res.status(200);
		res.send(bufA.toString());
		res.end();
	}
);


var server = app.listen(port, function () {
  var port = server.address().port;
  console.log('Example app listening at http://localhost:%s', port);
});
