/**
 * Unit tests for /src/Class.js
 */

var Class = JSLite.Class;
var ClassFactory = JSLite.ClassFactory;
var JSLiteException = JSLite.JSLiteException;

var A = (new Class)
  .statics({
    foo:'bar',
    obj: {x:1, y:2},
    times:function(n){return n*2}
  })
  .members({
    plus:function(n){return n+1},
    obj: {x:1, y:2}
  })
  .finalize();

var B = (new Class).extend(A)
  .statics({
    baz:'biz',
    obj: {y:3, z:4}
  })
  .members({
    plus:function(n){return n+2},
    obj: {y:3, z:4}
  })
  .finalize();

var a = new A;
var b = new B;

test("proxy", function(assert){
  
  var fn = function(x, y){return [this, x, y]};
  var fna = a.proxy(fn, 25);
  
  assert.equal(fna()[0], a, "Proxied functions have the right context.");
  assert.equal(fna()[1], 25, "Proxied functions remember parameters.");
  assert.equal(fna(50)[2], 50, "Proxied functions accept new parameters.");
  
});

test("super", function(assert){
  assert.equal(b.plus(1), 3, "The method was overridden.");
  assert.equal(b.super('plus', [1]), 2, "The super method allowed the parent to be called.");
});

test("combine", function(assert){
  ok(b.obj, "The b instance has an `obj` property.");
  assert.deepEqual(b.combine('obj'), {x:1, y:3, z:4}, "An object was combined.");
});

test("getStatic", function(assert){
  assert.equal(b.getStatic('baz'), 'biz', "GetStatic returned a value from its own class.");
  assert.equal(b.getStatic('foo'), 'bar', "GetStatic returned a value from the parent class.");
});

test("callStatic", function(assert){
  assert.equal(b.callStatic('times', [2]), 4, "CallStatic called a static function on the parent class.");
  throws(function(){b.callStatic('nyerk')}, JSLiteException, "An exception is raised when method not found.");
});

test("combineStatic", function(assert){
  ok(B.obj, "The B class has an `obj` property.");
  assert.deepEqual(b.combineStatic('obj'), {x:1, y:3, z:4}, "A static object was combined.");
});
