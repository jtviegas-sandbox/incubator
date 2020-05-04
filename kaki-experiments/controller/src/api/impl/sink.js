'use strict';
var kafka = require('kafka-node');

var Sink = function(){

    var producer = null;
    var status = null;

    var IP = process.env.ZOOKEEPER_IP || 'zookeeper';
    var PORT = process.env.ZOOKEEPER_PORT || '2181';
    var connectionString = IP + ':' + PORT + '/';
    console.log('connectionString: ' + connectionString);

    var producer = new kafka.Producer(new kafka.Client(connectionString));

    producer.on('ready', function () {
        status = 'ready';
        console.log('producer is ready');
    });

    producer.on('error', function (err) {
        status = 'error';
        console.log( 'producer error', err);
    });

    var send = function(topic, msg, callback) {
        if( (null == status) || ('ready' != status) )
            return callback(new Error('can\'t send message, producer not ready'));

        var o = [ { 'topic': topic, 'messages': msg } ];
        producer.send(o, function (err) {
            if(err)
                callback(new Error('can\'t send message, producer not ready'));
            else
                callback(null);
        });
    };

    return { send: send };
}();

module.exports = Sink;



