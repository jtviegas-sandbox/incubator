/**
 * Created by joaovieg on 12/03/17.
 */
"use strict";
var sink = require('./kafkaSink');

var SinkFactory = function(){

    var instance;

    var getInstance = function(){
        if(null == instance){
            instance = sink();
        }
        return instance;
    };

    return { getInstance: getInstance }

}();

module.exports = SinkFactory;
