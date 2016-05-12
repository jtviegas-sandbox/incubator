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

fw.module = (function () {
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  var
    configMap = {
      main_html : String()
		+' 		<div class="modBodyCenter">'
		+' 		</div>'
		+' 		<div class="modBodyFooter">'
    +'      text 2 add:'
    +'      <input type="text" id="text2add"/><br/>'
    +'      <a href="#" id="link2add">add</a>'
    +'      text 2 add:'
    +'      <input type="text" id="text2add"/><br/>'
    +'      <a href="#" id="link2add">add</a>'
		+' 			text 2 add:'
		+' 			<input type="text" id="text2add"/><br/>'
		+' 			<a href="#" id="link2add">add</a>'
        +'      text 2 add:'
    +'      <input type="text" id="text2add"/><br/>'
    +'      <a href="#" id="link2add">add</a>'
    +'      text 2 add:'
    +'      <input type="text" id="text2add"/><br/>'
    +'      <a href="#" id="link2add">add</a>'
    +'      text 2 add:'
    +'      <input type="text" id="text2add"/><br/>'
    +'      <a href="#" id="link2add">add</a>'
        +'      text 2 add:'
    +'      <input type="text" id="text2add"/><br/>'
    +'      <a href="#" id="link2add">add</a>'
    +'      text 2 add:'
    +'      <input type="text" id="text2add"/><br/>'
    +'      <a href="#" id="link2add">add</a>'
    +'      text 2 add:'
    +'      <input type="text" id="text2add"/><br/>'
    +'      <a href="#" id="link2add">add</a>'
        +'      text 2 add:'
    +'      <input type="text" id="text2add"/><br/>'
    +'      <a href="#" id="link2add">add</a>'
    +'      text 2 add:'
    +'      <input type="text" id="text2add"/><br/>'
    +'      <a href="#" id="link2add">add</a>'
    +'      text 2 add:'
    +'      <input type="text" id="text2add"/><br/>'
    +'      <a href="#" id="link2add">add</a>'
        +'      text 2 add:'
    +'      <input type="text" id="text2add"/><br/>'
    +'      <a href="#" id="link2add">add</a>'
    +'      text 2 add:'
    +'      <input type="text" id="text2add"/><br/>'
    +'      <a href="#" id="link2add">add</a>'
    +'      text 2 add:'
    +'      <input type="text" id="text2add"/><br/>'
    +'      <a href="#" id="link2add">add</a>'
        +'      text 2 add:'
    +'      <input type="text" id="text2add"/><br/>'
    +'      <a href="#" id="link2add">add</a>'
    +'      text 2 add:'
    +'      <input type="text" id="text2add"/><br/>'
    +'      <a href="#" id="link2add">add</a>'
    +'      text 2 add:'
    +'      <input type="text" id="text2add"/><br/>'
    +'      <a href="#" id="link2add">add</a>'
		+' 		</div>',
      settable_map : {}
    },
    stateMap  = { $container : null , $name : "example module"},
    jqueryMap = {},

    setJqueryMap, configModule, initModule;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //------------------- BEGIN UTILITY METHODS ------------------
  //-------------------- END UTILITY METHODS -------------------

  //--------------------- BEGIN DOM METHODS --------------------
  // Begin DOM method /setJqueryMap/
  setJqueryMap = function () {
    var $container = stateMap.$container;
    jqueryMap = { $container : $container };
  };
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
  config = function ( input_map ) {
    fw.util.setConfigMap({
      input_map    : input_map,
      settable_map : configMap.settable_map,
      config_map   : configMap
    });
    return true;
  };

  init = function ( $container ) {
    $container.append( configMap.main_html );
    stateMap.$container = $container;
    setJqueryMap();
    return true;
  };
  // End public method /initModule/

  // return public methods
  return {
    config : config,
    init   : init,
    name: stateMap.$name
  };
  //------------------- END PUBLIC METHODS ---------------------
}());



