var express = require('express');
var PragmaLogger = require('pragma-logger');
var util = require('util');
var logger = new PragmaLogger({
    logger: {
      charset: 'utf8',
      levels: {
        debug: './logs/%pid_debug_%y-%m-%d-minits.log',
        error: './logs/%pid_error_%y-%m-%d-minits.log',
        warn: './logs/%pid_warn_%y-%m-%d-minits.log',
        trace: './logs/%pid_trace_%y-%m-%d-minits.log',
        info: './logs/%pid_info_%y-%m-%d-minits.log'
      },
      messageFormat: '%t \t| %name :: %lvl \t| PID: %pid - %msg'
    }
  }, 
'minits');

var minitsdbsink = require('./minitsdbsink');
var consolesink = require('./consolesink');

var router = express.Router();
var minitschain = [ minitsdbsink.execute ];
router.post('/io', minitschain);
logger.info('loaded minits');

module.exports = router;