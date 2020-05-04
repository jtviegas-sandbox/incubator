'use strict';
var util = require('util');
var request = require('request');

var Google = function(){

    const PRICES_URI = "https://www.google.com/finance/getprices";
    const DAY_INTERVAL = '86400';
    const SINCE_EVER = '40Y';

    var getDailyValues = function(ticker, callback) {
        console.log('getDailyValues');
        var s = ticker.split(":");
        if( (! Array.isArray(s)) || ( 2 != s.length ) ){
            callback(new Error("wrong ticker"));
        }

        var exchange = s[0];
        var stock = s[1];

        var o = '';
        var options = {
            method: 'GET'
            , uri: PRICES_URI
            , headers: [{name: 'Content-Type', value: 'application/json'}]
            , qs: {q: stock, x: exchange, i: DAY_INTERVAL, p: SINCE_EVER, f: 'd,c,v,k,o,h,l' }
        };
        request(options)
            .on('error', function(error) {
                callback(error);
            })
            .on('data', function(data) {
                // decompressed data as it is received
                //console.log('ondata decoded chunk: ' + data)
                o += data;
            })
            .on('end', function(data) {
                // decompressed data as it is received
                //console.log('on end: ' + data);
                if(data)
                    o += data;

                var result = transform(ticker, o);
                //console.log(result);
                callback(null, result);
            })
        ;
    };

    var transform = function(ticker, r){

        var result = [];
        var lines = r.split('\n');

        var linenum = 0, marketCloseMin = 0, interval = 0, initialTs = 0,
            ts = 0, close=0, high=0, low=0, open=0, volume=0;
        // get header data
        var line = null;
        while('DATA=' != (line = lines[linenum++].trim()) && linenum < lines.length ){
            var s = line.split('=');
            if(s[0] == 'INTERVAL')
                interval = parseInt(s[1]);
        }

        while(linenum < lines.length){
            line = lines[linenum++].trim();

            if( (0 == line.length) || (null != line.match('TIMEZONE_OFFSET.*')) )
                continue;

            var fields = line.split(',');

            if(null != fields[0].match('a[0-9]{7,10}')){
                initialTs = parseInt(fields[0].substring(1));
                ts = initialTs;
            }
            else
                ts = initialTs + parseInt(fields[0]) * interval;

            close = parseFloat(fields[1]);
            high = parseFloat(fields[2]);
            low = parseFloat(fields[3]);
            open = parseFloat(fields[4]);
            volume = parseInt(fields[5]);

            result.push(createSeriesEntry(ticker, ts, close, high, low, open, volume));
        }

        return result;
    }

    var createSeriesEntry = function(ticker, ts, close, high, low, open, volume){
        var o = {
            "tags":[],
            "fields": [],
            "ts": ts
        };

        o.tags.push( {"name": "ticker", "value": ticker } );

        o.fields.push( {"name": "close", "value": close } );
        o.fields.push( {"name": "high", "value": high } );
        o.fields.push( {"name": "low", "value": low } );
        o.fields.push( {"name": "open", "value": open } );
        o.fields.push( {"name": "volume", "value": volume } );

        return o;
    };

    return { getDailyValues: getDailyValues };

}();

module.exports = Google;



