'use strict';

var util = require('util');
var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var argv = require('minimist')(process.argv.slice(2));


var auth = require(__dirname + '/api/impl/auth');
var logger = require(__dirname + '/api/impl/apputils').logger;

module.exports = app; // for testing

var port = process.env.PORT || 3000;
if(argv.port !== undefined)
    port = argv.port;
else
    console.log('No --port=xxx specified, taking default port ' + port + '.')

var domain = 'localhost';
if(argv.domain !== undefined)
    domain = argv.domain;
else
    console.log('No --domain=xxx specified, taking default hostname "localhost".')

var applicationUrl = 'http://' + domain + ':' + port;

var config = {
    appRoot: __dirname // required config
};

app.use(auth.validate);

SwaggerExpress.create(config, function(err, swaggerExpress) {
    if (err) { throw err; }
    swaggerExpress.register(app);
    app.listen(port);
    if (swaggerExpress.runner.swagger.paths['/hello']) {
        logger.info(util.format('split4ever started on %s', applicationUrl));
    }
});

//app.use(/\/((?!swagger).)*/, auth.validate);
//app.use('/series', series);
