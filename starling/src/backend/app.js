var express = require('express');
var app = express();

var port = process.env.VCAP_APP_PORT || 8080
var host = process.env.VCAP_APP_HOST || 'localhost';



// custom 404 page
app.use(function(req, res){
	res.type('text/plain');
	res.status(404);
	res.send('404 - Not Found');
});

// custom 500 page
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.type('text/plain');
	res.status(500);
	res.send('500 - Server Error');
});

var server = app.listen(port, host, function () {
	
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
  console.log('OI');
});
