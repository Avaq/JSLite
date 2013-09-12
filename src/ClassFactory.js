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
   * Goes up the chain of inheritance to find the first class that has the static property of the given name.
   *
   * @param {String} name The name of the property to check for.
   * @param {Class} context The class instance to start in.
   *
   * @return {Object|false} The result, or false if not found.
   */
  function findStaticWith(name, context){
    var clazz = context._STATIC;
    while(clazz && !hasOwn.call(clazz, name)){
      clazz = clazz._PARENT;
    }
    return clazz;
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
      this._class._PARENT = parent;
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
    constructor._PARENT = Class;
    constructor.prototype = this;
    return new ClassFactory(constructor);
  }
  
  //Class has no parent.
  Class._PARENT = false;
  
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
      
    },
    
    /**
     * Call a method on the parent class.
     *
     * @param {String} name The name of the method to call.
     * @param {Array|Arguments} args An optional map of arguments to apply.
     *
     * @return {Object} Anything that was returned by the called method.
     */
    super: function(name, args){
      return this._STATIC._PARENT.prototype[name].apply(this, args||[]);
    },
    
    /**
     * Get the value of a static property, somewhere along the chain of parent classes.
     *
     * @param {String} name The name of the property to look for.
     *
     * @return {Object} The value of the property or undefined.
     */
    getStatic: function(name){
      var clazz = findStaticWith(name, this);
      return clazz ? clazz[name] : undefined;
    },
    
    /**
     * Call and get the return value of a static method, somewhere along the chain of parent classes.
     *
     * @param {String} name The name of the method to look for.
     * @param {Array|Arguments} args The arguments to pass to the method.
     * 
     * @throws {JSLite.JSLiteException} If The method is not found.
     *
     * @return {Object} The return value of the method.
     */
    callStatic: function(name, args){
      var clazz = findStaticWith(name, this);
      if(!clazz) throw new JSLite.JSLiteException(
        "None of the parent classes of '"+typeof this+"' have method '"+name+"'."
      );
      return clazz[name].apply(clazz, args||[]);
    }
    
  };
  
  //Export to JSLite.
  global.JSLite.ClassFactory = ClassFactory;
  global.JSLite.Class = Class;
    
}(this||window));
