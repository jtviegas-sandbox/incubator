/*
 * spa.util.js
 * General JavaScript utilities
 *
 * Michael S. Mikowski - mmikowski at gmail dot com
 * These are routines I have created, compiled, and updated
 * since 1998, with inspiration from around the web.
 *
 * MIT License
 *
*/

/*jslint          browser : true,  continue : true,
  devel  : true,  indent  : 2,     maxerr   : 50,
  newcap : true,  nomen   : true,  plusplus : true,
  regexp : true,  sloppy  : true,  vars     : false,
  white  : true
*/
/*global $, spa */

fw.util = (function () {
  var makeError, setConfigMap;

  // Begin Public constructor /makeError/
  // Purpose: a convenience wrapper to create an error object
  // Arguments:
  //   * name_text - the error name
  //   * msg_text  - long error message
  //   * data      - optional data attached to error object
  // Returns  : newly constructed error object
  // Throws   : none
  //
  makeError = function ( name_text, msg_text, data ) {
    var error     = new Error();
    error.name    = name_text;
    error.message = msg_text;

    if ( data ){ error.data = data; }

    return error;
  };
  // End Public constructor /makeError/

  // Begin Public method /setConfigMap/
  // Purpose: Common code to set configs in feature modules
  // Arguments:
  //   * inputMap    - map of key-values to set in config
  //   * settableMap - map of allowable keys to set
  //   * configMap   - map to apply settings to
  // Returns: true
  // Throws : Exception if input key not allowed
  //
  setConfigMap = function ( arg_map ){
    var
      inputMap    = arg_map.inputMap,
      settableMap = arg_map.settableMap,
      configMap   = arg_map.configMap,
      key_name, error;

    for ( key_name in inputMap ){
        if ( settableMap.hasOwnProperty( key_name ) ){
          configMap[key_name] = inputMap[key_name];
        }
        else {
          error = makeError( 'Bad Input',
            'Setting config key |' + key_name + '| is not supported'
          );
          throw error;
        }
    }
    return configMap;
  };
  // End Public method /setConfigMap/

  return {
    makeError    : makeError,
    setConfigMap : setConfigMap
  };
}());
