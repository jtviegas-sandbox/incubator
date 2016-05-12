/*
 * spa.chat.js
 * Chat feature module for SPA
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, ws */

fw.twitter = (function () {
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------

  var settableMap = {
      html: null
    },
    inputMap = {
        html: String()
          +'    <div class="modBodyCenter">'
          +'      <label>Results</label><br/>'
          +'      <textarea class="fw-twitter-display-textarea"></textarea>'
          +'      <a id="authenticateAction">authenticate</a>'
          +'    </div>'
          +'    <div class="modBodyFooter">'
          +'    </div>'
      },
    configMap = {
        html: null,
        name: "twitter tests module",
        jqueryMap : {
          container : null
        }
      },
      setJqueryMap, loadEvents,
      config, init;

  //----------------- END MODULE SCOPE VARIABLES ---------------

  //------------------- BEGIN UTILITY METHODS ------------------
  //-------------------- END UTILITY METHODS -------------------

  //--------------------- BEGIN DOM METHODS --------------------
  // Begin DOM method /setJqueryMap/
  setJqueryMap = function (containerPointer) {
    configMap.jqueryMap = { 
      container : containerPointer,
      authenticateAction: containerPointer.find('#authenticateAction')
    };

  };

  loadEvents = function () {
    configMap.jqueryMap.authenticateAction.click(
      function(){
        console.log('going to authenticate');
        
      }
    );
  }
  // End DOM method /setJqueryMap/
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  //-------------------- END EVENT HANDLERS --------------------

  //------------------- BEGIN PUBLIC METHODS -------------------
  // Begin public method /configModule/
  // Purpose    : Adjust configuration of allowed keys
  // Arguments  : A map of settable keys and values
  //   * color_name - color to use
  // Settings   :
  //   * configMap.settable_map declares allowed keys
  // Returns    : true
  // Throws     : none
  //
  config = function (inputMapPointer) {
      fw.util.setConfigMap({
          inputMap    : inputMap,
          settableMap : settableMap,
          configMap   : configMap
      });
    return true;
  };

  init = function ( $container ) {
    $container.append( configMap.html );
    setJqueryMap($container);
    loadEvents();
    return true;
  };
  // End public method /initModule/

  // return public methods
  return {
    config : config,
    init   : init,
    name: configMap.name
  };
  //------------------- END PUBLIC METHODS ---------------------
}());



