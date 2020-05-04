/**
 * Created by joaovieg on 22/01/17.
 */

var Config = function(){

    var constants = {
        PRODUCER_TOPIC: 'producer_ticker'
        , SERVICE_TYPE: 'producer'
        , ZOOKEEPER_IP: 'zookeeper'
        , ZOOKEEPER_PORT: '2181'
    };

/*    if (process.env.ZOOKEEPER_IP)
        constants.ZOOKEEPER_IP = process.env.ZOOKEEPER_IP;
    if (process.env.ZOOKEEPER_PORT)
        constants.ZOOKEEPER_PORT = process.env.ZOOKEEPER_PORT;*/

    var log = {
        dir: process.env.LOG_DIR || './logs'
        , level: process.env.LOG_LEVEL || 'debug'
        , filename: process.env.LOG_FILENAME || 'trace.log'
        , filesize: process.env.LOG_FILESIZE || 1048576
        , filenum: process.env.LOG_FILENUM || 5
    }



    return {
        constants: constants
        , log: log
    };
}();

module.exports = Config;