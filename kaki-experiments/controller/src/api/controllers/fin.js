'use strict';

var google = require('../impl/google');
var sink = require('../impl/sink');
var config = require('../impl/config');
var logger = require('../impl/apputils').logger;

var Fin = function(){
    var getTicker = function(req, res) {
        var ticker = req.swagger.params.ticker.value;
        console.log('ticker');
        google.getDailyValues(ticker, function(err, o){
            var result = {};
            if(err){
                result.ok = false;
                result.result = err;
                res.json(result);
            }
            else {
                sink.send(config.constants.TICKER_TOPIC, { "statement": "insert", "series": o }, function(err){
                    if(err){
                        logger.error(err);
                        result.ok = false;
                        result.result = { "msg": err.message };
                    }
                    else {
                        result.ok = true;
                        result.result = { "ticker": ticker, "series.length": o.length };
                    }
                    res.json(result);
                } );
            }
        });
    };

    return { getTicker: getTicker };
}();

module.exports = Fin;



