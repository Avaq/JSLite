/*jslint browser: true, forin: true, nomen: true, white: true */
(function(global){
  
  "use strict";
  
  /**
   * Create aliases for commonly used native code.
   * 
   * @function hasOwn Object.prototype.hasOwnProperty
   * @function slice Array.prototype.slice
   */
  var hasOwn = Object.prototype.hasOwnProperty
    , slice = Array.prototype.slice;
  
  /**
   * Flat object extend.
   * 
   * @param {object} target The object that will be extended.
   * @param {object} object The first object that extends the target.
   * @param {object} ... The previous parameter repeats indefinitely, each new parameter
   *                     overrides the identical keys from the previous object.
   *
   * @return {object} The target after the extensions are applied.
   */
  function extend(target){
    var i, key, objects = slice.call(arguments, 1);
    for(i in objects){
      if(hasOwn.call(objects, i)){
        for(key in objects[i]){if(hasOwn.call(objects[i], key)){
            target[key] = objects[i][key];
          }
        }
      }
    }
    return target;
  }
  
  /**
   * Constructs a ClassFactory.
   * 
   * ClassFactory wraps a constructor. It has methods that can change the constructor
   * and its object properties and prototype.
   *
   * @param {function} constructor The initial constructor.
   */
  function ClassFactory(constructor){
    this._class = this._noop = constructor;
  }
  
  //Define the members of the ClassFactory instances.
  ClassFactory.prototype = {
    
    /**
     * Make the given Class the parent of the wrapped class.
     *
     * @param {Class} parent
     *
     * @chainable
     */
    extend: function(parent){
      this._class.prototype = extend(Object.create(parent.prototype), this._class.prototype);
      if(!this.hasConstructor()){
        this.construct(function(){parent.apply(this, arguments);});
      }
      return this;
    },
    
    /**
     * Change the constructor of the class.
     *
     * @param {function} constructor The new constructor.
     *
     * @chainable
     */
    construct: function(constructor){
      constructor.prototype = this._class.prototype;
      extend(constructor, this._class);
      this._class = constructor.prototype._STATIC = constructor;
      return this;
    },
    
    /**
     * Add members to out class.
     *
     * @param {object} members The object that will be merged with the prototype.
     *
     * @chainable
     */
    members: function(members){
      extend(this._class.prototype, members);
      return this;
    },
    
    /**
     * Add static members to out class.
     *
     * @param {object} members The object that will be merged with the class.
     *
     * @chainable
     */
    statics: function(members){
      extend(this._class, members);
      return this;
    },
    
    /**
     * Finalize the class, returning the wrapped constructor.
     *
     * @return {Class}
     */
    finalize: function(){
      return this._class;
    },
    
    /**
     * Returns true if the constructor has changed since the factory was created.
     *
     * @return {boolean}
     */
    hasConstructor: function(){
      return this._class !== this._noop;
    }
    
  };
  
  /**
   * Construct a Class and return it in a ClassFactory.
   */
  function Class(){
    var constructor = function(){};
    this._STATIC = constructor;
    constructor.prototype = this;
    return new ClassFactory(constructor);
  }
  
  /**
   * Defines some standard class behaviour functions.
   * @type {Object}
   */
  Class.prototype = {
    
    /**
     * Proxy a function to this class.
     * 
     * Returns a copy of the given function, which when called will always have this Class
     * instance as its context.
     *
     * @param {function} func The function to bind to this.
     *
     * @return {function} The replacement function which is bound to this class.
     */
    proxy: function(func){
      
      var context = this
        , args = slice.call(arguments, 1);
      
      return function(){return func.apply(context, args.concat(slice.call(arguments)));};
      
    }
    
  };
  
  //Export to JSLite.
  global.JSLite.ClassFactory = ClassFactory;
  global.JSLite.Class = Class;
    
}(this||window));
