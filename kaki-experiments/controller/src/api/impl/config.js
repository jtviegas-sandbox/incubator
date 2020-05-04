/**
 * Created by joaovieg on 22/01/17.
 */

var Config = function(){

    var constants = {
        TICKER_TOPIC: 'ticker'
    };

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