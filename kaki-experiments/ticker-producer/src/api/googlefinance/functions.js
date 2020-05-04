/**
 * Created by joaovieg on 12/03/17.
 */
"use strict";

var util = require('util');
var logger = require('../common/apputils').logger;
var config = require('../common/config');
var google = require('./google');



var GoogleFinanceFunctions = function(){

    var process = function(req,res, next){
        logger.debug('[GoogleFinanceFunctions.process] IN');

        // {  symbol: '', exchange: ''}
        var obj = req.body;
        var security = util.format('%s:%s', obj.symbol, obj.exchange);

        google.getSeries(security, function(err, o){
            var result = {};
            if(err){
                result.ok = false;
                result.result = err;
                logger.debug('[GoogleFinanceFunctions.process] could not get data: %s', err.message);
                res.json(result);
            }
            else {
                req.body.output = {};
                req.body.output.src = "GoogleFinanceFunctions";
                req.body.output.series = o;
                logger.debug('[GoogleFinanceFunctions.process] got data: %d', o.length);
                next();
            }
        });

        logger.debug('[GoogleFinanceFunctions.process] OUT');
    };

    return {
        process: process
    };

}();

module.exports = GoogleFinanceFunctions;