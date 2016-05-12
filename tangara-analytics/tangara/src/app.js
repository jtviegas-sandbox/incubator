var express = require('express');
var util = require('util');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieSession = require('cookie-session');
var uuid = require('uuid');
var cookieParser = require('cookie-parser');
var events = require('events');

//CONSTANTS

var PORT=8080;
var BODY_MAX_SIZE = '10240kb';

//...load modules

var analytics = require('./analytics');
var minits = require('./minits');

var custom = require('./custom');
var PragmaLogger = require('pragma-logger');
var logger = new PragmaLogger({
    logger: {
      charset: 'utf8',
      levels: {
        debug: './logs/%pid_debug_%y-%m-%d-app.log',
        error: './logs/%pid_error_%y-%m-%d-app.log',
        warn: './logs/%pid_warn_%y-%m-%d-app.log',
        trace: './logs/%pid_trace_%y-%m-%d-app.log',
        info: './logs/%pid_info_%y-%m-%d-app.log'
      },
      messageFormat: '%t \t| %name :: %lvl \t| PID: %pid - %msg'
    }
  }, 'app');

var app = express();

//...setup cookie sessions

app.use(cookieSession({
  name: 'session',
  keys: ['yet another colored bird', 'Tangara is a large genus of colored birds of the tanager family. It includes about 50 species, all beautiful.'],
  cookie: {
    maxAge : 30*24*60*60*1000
  }
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: BODY_MAX_SIZE }));
app.use(bodyParser.text());
app.use(methodOverride());

//...setup start and end processors

var start = function (req, res, next) {
  //setup session object
  req.session.id = req.session.id || uuid.v4();
  req.session.data = {
    topic: 'default',
    badEntries: [],
    timeseries: [],
    errors : []
  };
  logger.info('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  logger.info(util.format('started chain for session %s', req.session.id));
  next();
};

var end = function (err, req, res) {
  logger.info('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
  logger.info(util.format('end of chain for session %s', req.session.id));
  res.cookie('sessionId', req.session.id);
  res.status(200);
  res.end(JSON.stringify( { "result": 0 , "sessionId": req.session.id } ) );
};

// ...   definition of chains

//redirect analytics traffic
app.use('/analytics', start, analytics, end);
app.use('/minits', start, minits, end);

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


// ... start server

if(process.env.PORT)
    PORT=process.env.PORT;

var server = app.listen(PORT, function () {
  var host = server.address().address;
  var port = server.address().port;
  logger.info(util.format('tangara listening at http://%s:%s', host, port));
});



