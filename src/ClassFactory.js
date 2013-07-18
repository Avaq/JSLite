;(function(global){
  
  "use strict";
  
  /**
   * Alias for Object.prototype.hasOwnProperty.
   */
  var hasOwn = Object.prototype.hasOwnProperty;
  
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
    var i, key, objects = Array.prototype.slice.call(arguments, 1);
    for(i in objects){
      if(hasOwn.call(objects, i)){
        for(key in objects[i]){
          if(hasOwn.call(objects[i], key)){
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
      if(!this.hasConstructor()) this.construct(function(){parent.apply(this, arguments)});
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
      this._class = constructor;
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
    constructor.prototype = Object.create(Class.prototype);
    return new ClassFactory(constructor);
  }
  
  //Export to JSLite.
  global.JSLite.ClassFactory = ClassFactory;
  global.JSLite.Class = Class;
    
}(this||window));
