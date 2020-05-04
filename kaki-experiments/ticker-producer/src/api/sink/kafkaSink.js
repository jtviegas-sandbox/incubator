'use strict';

var util = require('util');
var kafka = require('kafka-node');
var logger = require('../common/apputils').logger;
var conf = require('../common/config');

var KafkaSink = function(){

    var producer;
    var status = 'idle';

    var process = function(req, res) {
        logger.debug('[KafkaSink.process] IN');
        if ('ready' != status)
            res.status(500).send({ "ok": false, "msg": "sink is not ready" });

        var msg = [ { 'topic': req.body.output.topic, 'messages': [ req.body.output ] } ];
        console.log(JSON.stringify(req.body.output));
        producer.send(msg, function (err,data) {
            if (err) {
                res.status(500).send({"ok": false, "msg": err.message});
                logger.debug('did not send message: %s', err.message);
            }
            else {
                res.status(200).send({"ok": true});
                logger.debug('sent message successfully');
            }
        });
        logger.debug('[KafkaSink.process] OUT');
    };

    var init = function(ip, port){
        logger.debug('[KafkaSink.init] IN');
        if('ready' != status){
            var connectionString = ip + ':' + port;
            logger.debug('[KafkaSink.init] connectionString: ', connectionString);
            producer = new kafka.Producer(new kafka.Client(connectionString));
            producer.on('ready', function () {
                status = 'ready';
                logger.debug('[KafkaSink.init] producer is ready');
            });
            producer.on('error', function (err) {
                logger.debug( '[KafkaSink.init] producer error', err);
            });
        }
        logger.debug('[KafkaSink.init] OUT');
    };


    return { process: process
            , init: init };
};

module.exports = KafkaSink;



