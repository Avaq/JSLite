(function(global){
  
  "use strict";
  
  //Imports.
  var hasOwn = Object.prototype.hasOwnProperty
    , JSLite = global.JSLite
    , Class = JSLite.Class
    , utils = JSLite.utils;
  
  //Create the Event class.
  var Event = (new Class)
  
  /**
   * Construct an Event.
   *
   * @param {String} eventName The name/type of the event.
   * @param {Object} properties Extra properties to add to the event.
   */
  .construct(function(eventName, properties){
    
    //Initiate variables.
    var prop, special = ['stopPropagation', 'stopImmediatePropagation'];
    
    //Allow construction without "new".
    if(!(this instanceof Event)){
      return new Event(eventName, properties);
    }
    
    //Use special properties to call methods.
    for(prop in properties){
      if(hasOwn.call(properties, prop) && properties[prop] == true && special.indexOf(prop) >= 0){
        this[prop]();
      }
    }
    
    //Set given and default properties.
    utils.extend(this, properties, {
      type: eventName,
      currentType: eventName,
      timeStamp: (new Date()).getTime()
    });
    
  })
  
  //Members for the Event class.
  .members({
    
    type: null,
    timeStamp: null,
    stopped: 0,
    returnValue: undefined,
    returnValues: [],
    
    stopPropagation: function(){
      this.stopped = 1;
    },
    
    stopImmediatePropagation: function(){
      this.stopped = 2;
    },
    
    isPropagationStopped: function(){
      return this.stopped >= 1;
    },
    
    isImmediatePropagationStopped: function(){
      return this.stopped >= 2;
    }
    
  })
  
  //Finalize the Event class.
  .finalize();
  
  var EventMixin = {
    
    eventListeners: null,
    
    on: function(eventName, callback){
      
      //Add the event listener.
      this.addListener(eventName, callback);
      
      //Enable chaining.
      return this;
      
    },
    
    once: function(eventName, callback){
      
      //Initiate variables.
      var descriptor;
      
      //Create a custom listener.
      var listener = this.proxy(function(){
        this.removeListener(eventName, callback);
        return callback.apply(this, arguments);
      });
      
      //Add the listener normally, but acquire the descriptor.
      descriptor = this.addListener(eventName, listener);
      
      //Fix the descriptor to point to the original callback.
      descriptor.callback = callback;
      
      //Enable chaining.
      return this;
      
    },
    
    no: function(eventName, callback){
      
      //Remove a single callback?
      if(callback instanceof Function){
        this.removeListener(eventName, callback);
      }
      
      //Remove all listeners from a name?
      else{
        this.removeListeners(eventName);
      }
      
      //Enable chaining.
      return this;
      
    },
    
    trigger: function(eventName, properties){
      
      this._initEvents();
      
      var i
        , j
        , ret
        , key
        , listeners
        , e = new Event(eventName, properties)
        , parts = eventName.split(':');
      
      for(i=parts.length; i>0; i--){
        
        key = parts.slice(0,i).join(':');
        
        if(!hasOwn.call(this.eventListeners, key)){
          continue;
        }
        
        listeners = this.eventListeners[key];
        e.currentType = key;
        e.typeStack = parts.slice(i);
        
        for(j=0; j<listeners.length; j++){
          
          ret = listeners[j].handler.call(this, e);
          
          if(ret !== undefined){
            e.returnValues.push(ret);
            e.returnValue = ret;
          }
          
          if(e.isImmediatePropagationStopped()){
            break;
          }
          
        }
        
        if(e.isPropagationStopped()){
          break;
        }
        
      }
      
      return e;
      
    },
    
    addListener: function(eventName, callback){
      
      this._initEvents();
      
      var descriptor = {
        type: eventName,
        callback: callback,
        handler: callback
      };
      
      (this.eventListeners[eventName] || (this.eventListeners[eventName] = [])).unshift(descriptor);
      
      return descriptor;
      
    },
    
    removeListener: function(eventName, callback){
      
      this._initEvents();
      
      if(!hasOwn.call(this.eventListeners, eventName)){
        return false;
      }
      
      var i, listeners = this.eventListeners[eventName];
      
      for(i=0; i<listeners.length; i++){
        if(listeners[i].callback === callback){
          listeners.splice(i, 1)[0];
          i--;
        }
      }
      
      if(listeners.length === 0){
        this.removeListeners(eventName);
      }
      
      return true;
      
    },
    
    removeListeners: function(eventName){
      this._initEvents();
      if(!hasOwn.call(this.eventListeners, eventName)){
        return;
      }
      delete this.eventListeners[eventName];
    },
    
    _initEvents: function(){
      if(!this.eventListeners){
        this.eventListeners = {};
      }
    }
    
  };
  
  //Exports.
  JSLite.Event = Event;
  JSLite.EventMixin = EventMixin;
  
})(this||window);
