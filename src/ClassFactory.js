/*jslint browser: true, forin: true, plusplus: true, white: true */
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
   * Iterate a chain of objects to filter them based on the presence of the `search` property key.
   *
   * @param {String} search The name of the property to look for.
   * @param {String} chain The name of the chainable property.
   * @param {Object} object The object to start with.
   *
   * @return {Array} A list of objects in which the search property was found.
   */
  function chainFind(search, chain, object){
    var results = [];
    while(object){
      if(hasOwn.call(object, search)){
        results.push(object);
      }
      object = object[chain];
    }
    return results;
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
      this._class.parent = parent;
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
      this._class = constructor.prototype.constructor = constructor;
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
    this.constructor = constructor;
    constructor.parent = Class;
    constructor.prototype = this;
    return new ClassFactory(constructor);
  }
  
  //Class has no parent.
  Class.parent = false;
  
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
     * @param {Array|Arguments} args An optional array of arguments to apply.
     *
     * @return {Object} Anything that was returned by the called method.
     */
    super: function(name, args){
      return this.constructor.parent.prototype[name].apply(this, args||[]);
    },
    
    /**
     * Call the constructor of the parent class.
     *
     * @param {[Array|Arguments} args An optional array of arguments to apply.
     *
     * @return {void} Constructors don't return anything.
     */
    construct: function(args){
      this.constructor.parent.apply(this, args||[]);
    },
    
    /**
     * Get a merge of the given property throughout the prototype chain.
     *
     * Walks up the prototype chain to look for a property of the given name, and merges
     * every "state" (every occurrence of the property throughout the chain) with its
     * previous state. When keys overlap, the value of the latest occurrence (the
     * prototype closest to the invoking object) is used.
     *
     * @param {String} name The name of the property to combine.
     *
     * @return {Object|undefined} The combined property or undefined when none were found.
     */
    combine: function(name){
      
      //Initiate variables.
      var result = {}
        , i
        , objects = chainFind(name, '__proto__', this).reverse()
        , l = objects.length;
      
      // console.dir(this);
      // console.log(name, objects);
      
      //No objects?
      if(l === 0){
        return undefined;
      }
      
      //Combine objects.
      for(i=0;i<l;i++){
        extend(result, objects[i][name]);
      }
      
      //Return the result.
      return result;
      
    },
    
    /**
     * Get the value of a static property, somewhere along the chain of parent classes.
     *
     * @param {String} name The name of the property to look for.
     *
     * @return {Object} The value of the property or undefined.
     */
    getStatic: function(name){
      var object = chainFind(name, 'parent', this.constructor)[0];
      return object && object[name];
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
      var object = chainFind(name, 'parent', this.constructor)[0];
      if(!object){throw new JSLite.JSLiteException(
        "None of the parent classes of '"+typeof this+"' have method '"+name+"'."
      );}
      return object[name].apply(object, args||[]);
    },
    
    /**
     * Get a merge of the given property throughout the prototype chain.
     * 
     * @see {this.combine}
     *
     * @param {String} name The name of the property to combine.
     *
     * @return {Object|undefined} The combined property or undefined when none were found.
     */
    combineStatic: function(name){
      
      //Initiate variables.
      var result = {}
        , i
        , objects = chainFind(name, 'parent', this.constructor).reverse()
        , l = objects.length;
      
      //No objects?
      if(l === 0){
        return undefined;
      }
      
      //Combine objects.
      for(i=0;i<l;i++){
        extend(result, objects[i][name]);
      }
      
      //Return the result.
      return result;
      
    }
    
  };
  
  //Export to JSLite.
  global.JSLite.ClassFactory = ClassFactory;
  global.JSLite.Class = Class;
    
}(this||window));
