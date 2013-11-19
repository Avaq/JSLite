(function(global, undefined){
  
  /**
   * Construct a JSLiteException.
   *
   * @param {string} message The exception message.
   */
  function JSLiteException(message){
    this.message = message || this.message;
  }
  
  JSLiteException.prototype = {
    name: "JSLiteException",
    message: "An error occurred in JSLite.",
    toString: function(){
      return this.message;
    }
  }
  
  //Export to JSLite.
  global.JSLite = {};
  global.JSLite.JSLiteException = JSLiteException;
  global.JSLite.utils = {};
  
})(this||window);
