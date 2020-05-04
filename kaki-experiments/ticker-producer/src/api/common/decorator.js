/**
 * Created by joaovieg on 12/03/17.
 */
"use strict";

var util = require('util');
var logger = require('./apputils').logger;
var config = require('./config');

var Decorator = function(){

    var process = function(req,res, next){
        logger.debug('[Decorator.process] IN');
        req.body.output.type = config.constants.SERVICE_TYPE;
        req.body.output.topic = config.constants.PRODUCER_TOPIC;
        next();
        logger.debug('[Decorator.process] OUT');
    };

    return {
        process: process
    };

}();

module.exports = Decorator;