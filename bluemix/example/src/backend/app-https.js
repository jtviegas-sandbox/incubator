var fs = require('fs');
var https = require('https');
var express = require('express');
var constants = require('constants');
var app = express();

var port = process.env.VCAP_APP_PORT || 8043
var host = process.env.VCAP_APP_HOST || 'localhost';

var server = https.createServer({
      key: fs.readFileSync('server.key'),
      cert: fs.readFileSync('server.crt'),
      secureProtocol: 'SSLv23_method',
      secureOptions: constants.SSL_OP_NO_SSLv3
	}, 
	app).listen(port, host, function () {
	
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
  console.log('OI');
});

app.get('/', function (req, res) {
      res.header('Content-type', 'text/html');
      return res.end('<h1>Hello, Secure World!</h1>');
    });

