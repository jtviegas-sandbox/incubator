var http = require('http');
var url = require('url');
var qs = require('querystring');

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
	
  response.writeHead(200, {"Content-Type": "text/plain"});
  console.log(request.url);
  var parsedUrl = url.parse(request.url,true)
  var query = parsedUrl.query;
  console.log(query);
  response.write(qs.stringify(query));


  response.end();
  
});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8080);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8080/");
