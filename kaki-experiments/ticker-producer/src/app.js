'use strict';
var swaggerJSDoc = require('swagger-jsdoc');
var util = require('util');
var path = require('path');
var express = require('express');
var argv = require('minimist')(process.argv.slice(2));
var logger = require(__dirname + '/api/common/apputils').logger;
var googleFinance = require('./api/googlefinance/route');

var port = process.env.PORT || 3000;
if(argv.port !== undefined)
    port = argv.port;
else
    console.log('No --port=xxx specified, taking default port ' + port + '.');

var externalip = process.env.EXTERNAL_IP || 'localhost';
if(argv.externalip !== undefined)
    externalip = argv.externalip;
else
    console.log('No --externalip=xxx specified, taking default ip ' + externalip + '.');

// swagger definition
var swaggerDefinition = {
    info: {
        title: 'kaki-producer Swagger API',
        version: '1.0.0',
        description: 'kaki producer api user interface',
    },
    host: externalip + ':' + port,
    basePath: '/',
};

// options for the swagger docs
var options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./api/googlefinance/*.js'],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);


var app = express();


app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/googlefinance', googleFinance);

// serve swagger
app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// custom 404 page
app.use(function(req, res){
    logger.info(util.format('reached 404'));
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});

// custom 500 page
app.use(function(err, req, res, next){
    logger.error(util.format('reached 500: %s', err.stack));
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});

app.listen(port, function() {
    logger.info(util.format('server started on port %s', port));
});


module.exports = app; // for testing