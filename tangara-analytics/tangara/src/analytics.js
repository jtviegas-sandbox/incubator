var express = require('express');
var PragmaLogger = require('pragma-logger');
var util = require('util');
var logger = new PragmaLogger({
    logger: {
      charset: 'utf8',
      levels: {
        debug: './logs/%pid_debug_%y-%m-%d-analytics.log',
        error: './logs/%pid_error_%y-%m-%d-analytics.log',
        warn: './logs/%pid_warn_%y-%m-%d-analytics.log',
        trace: './logs/%pid_trace_%y-%m-%d-analytics.log',
        info: './logs/%pid_info_%y-%m-%d-analytics.log'
      },
      messageFormat: '%t \t| %name :: %lvl \t| PID: %pid - %msg'
    }
  }, 'analytics');

var timeseriesdbsink = require('./timeseriesdbsink');
var raw2timeseries = require('./raw2timeseries');
var consolesink = require('./consolesink');

var router = express.Router();
var csvchain = [ raw2timeseries.execute, timeseriesdbsink.execute, consolesink.execute ];
router.post('/io/csv', csvchain);
logger.info('loaded analytics');

module.exports = router;