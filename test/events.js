/**
 * Unit tests for /src/Class.js
 */

var Class = JSLite.Class;
var Event = JSLite.Event;
var EventMixin = JSLite.EventMixin;

test("Mixing", function(assert){
  
  var A = (new Class).members(EventMixin).finalize();
  var a = new A;
  
  console.dir(A);
  
  ok(a.on instanceof Function, "It appears like mixing worked.");
  
});

test("Binding and unbinding events", function(assert){
  
  var A = (new Class).members(EventMixin).finalize();
  var a = new A;
  var fn = function(){};
  
  a.on('test', fn);
  a.on('test', function(){});
  
  assert.equal(a.eventListeners['test'].length, 2, "Two listeners were added.");
  
  a.no('test', fn);
  
  assert.equal(a.eventListeners['test'].length, 1, "A single listener was removed.");
  
  a.on('test', fn);
  a.no('test');
  
  assert.equal(a.eventListeners['test'], undefined, "All listeners were removed.");
  
});

test("Triggering events", function(assert){
  
  var A = (new Class).members(EventMixin).finalize();
  var a = new A;
  
  expect(5);
  
  a.on('test', function(e){
    console.log(e);
    ok(true, "A callback was called.");
    assert.equal(this, a, "The context is the instance on which the event was triggered.");
    ok(e instanceof Event, "An event instance was passed.");
    assert.equal(e.type, 'test', "The event has the right type.");
    assert.equal(e.me, "Avaq", "A custom property was passed along.");
  });
  
  a.trigger('test', {me: "Avaq"});
  
  console.dir(a);
  
});

test("Binding events once", function(assert){
  
  var A = (new Class).members(EventMixin).finalize();
  var a = new A;
  var i = 0;
  
  a.once('test', function(){
    if(i==0){
      ok(true, "Callback was called.");
    }else{
      ok(false, "Callback was called a second time.");
    }
    i++
  });
  
  a.trigger('test');
  
  assert.equal(a.eventListeners['test'], undefined, "The listener was removed.");
  
  a.trigger('test');
  
});

test("Event propagation", function(assert){
  
  var A = (new Class).members(EventMixin).finalize();
  var a = new A;
  
  expect(6);
  
  a.on('test:foo:bar', function(e){
    assert.equal(e.currentType, "test:foo:bar", "The current type is what we expect at first level.");
    assert.deepEqual(e.typeStack, [], "Nothing in the typestack at first level.");
  });
  
  a.on("test:foo", function(e){
    ok(true, "Second level was reached.");
    assert.equal(e.type, "test:foo:bar", "The type in second level contains the original type.");
    assert.equal(e.currentType, "test:foo", "The current type is what we expect at second level.");
    assert.deepEqual(e.typeStack, ["bar"], "The typestack contains the key of the first level.");
  });
  
  a.trigger('test:foo:bar');
  
});
