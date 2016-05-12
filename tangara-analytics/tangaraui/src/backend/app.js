var express = require('express');
var util = require('util');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var uuid = require('uuid');
var cookieParser = require('cookie-parser');
var events = require('events');

//CONSTANTS
var PORT=8080;
var BODY_MAX_SIZE = '10240kb';

//load modules
var analytics = require('./analytics');
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

app.use(cookieSession({
  name: 'session',
  keys: ['yet another colored bird', 'Tangara is a large genus of colored birds of the tanager family. It includes about 50 species, all beautiful.'],
  cookie: {
    maxAge : 30*24*60*60*1000
  }
}));
app.use(cookieParser());
app.use(favicon('dist/backend/img/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: BODY_MAX_SIZE }));

//serve static files
var options = {
  dotfiles: 'ignore',
  etag: false,
   extensions: ['png', 'html'],
  redirect: false
};



var start = function (req, res, next) {
  req.session.id = req.session.id || uuid.v4();
  req.session.data = {
    topic: 'testtopic',
    badEntries: [],
    timeseries: [],
    errors : []
  };
  logger.info('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  logger.info(util.format('started chain for session %s', req.session.id));
  next();
};

var end = function (req, res) {
  logger.info('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
  logger.info(util.format('end of chain for session %s', req.session.id));
  res.cookie('sessionId', req.session.id);
  res.status(200);
  res.end(JSON.stringify({"result":0, "sessionId":req.session.id }));
};

// >>>>>>>>>>>>>>>>>>>>>>>>>    definition of chains

// frontend
app.use(express.static('dist/frontend', options));

//redirect analytics traffic
app.use('/analytics', start, analytics, end);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
});
// <<<<<<<<<<<<<<<<<<<<<<<<<


// >>>>>>>>>>>>>>>>>>>>>>>>> start server

if(process.env.PORT)
    PORT=process.env.PORT;

var server = app.listen(PORT, function () {
  var host = server.address().address;
  var port = server.address().port;
  logger.info(util.format('Example app listening at http://%s:%s', host, port));
});

var io = require('socket.io')(server);

/*
  we want to be notified when there is new data
  so that I can warn my clients about it
  so we are going to maintain a pool of socket connections
  and warn them about new data when it is there
*/
var sockets = [];

var removeSocketBySessionId = function(sessionId){
  for(var i = 0 ; i < sockets.length ; i++ ){
    var s = sockets[i];
    if(s.sessionId == sessionId ){
      sockets.splice(i,1);
      break;
    }
  }
};
var getSocketBySessionId = function(sessionId){
  var result = null;
  for(var i = 0 ; i < sockets.length ; i++ ){
    var s = sockets[i];
    if(s.sessionId == sessionId ){
      result = s;
      break;
    }
  }
  return result;

};

var socketInstance = io.of('/data/raw').on('connection', function (socket) {

    socket.on('sessionId', function (data) {
      console.log('new socket sessionId: ' + data);
      socket.sessionId = data;
      sockets.push(socket);
      console.log(sockets.length);
    });

    socket.on('disconnect', function (data) {
      console.log('disconnecting socket with sessionId: ' + socket.sessionId);
      removeSocketBySessionId(socket.sessionId);
      console.log(sockets.length);
    });
});


process.addListener('newData', 
  function(data){
    getSocketBySessionId(data.sessionId).emit('newData', data);
  }
);


