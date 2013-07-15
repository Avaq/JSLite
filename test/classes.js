/**
 * Unit tests for /src/Class.js
 */

var Class = JSLite.Class;
var ClassFactory = JSLite.ClassFactory;

test("Class factory", function(assert){
  
  var factory = new Class;
  
  ok(factory instanceof ClassFactory, "Creating a new class returns an instance of ClassFactory.");
  
  var MyClass = factory.finalize();
  
  ok(MyClass.prototype instanceof Class, "Finalizing the factory returns an object that has Class as its prototype.");
  
  var newFactory = new ClassFactory(MyClass);
  
  ok(newFactory instanceof ClassFactory, "Re-wrapping a class in a new factory returns an instance of ClassFactory.");
  assert.equal(newFactory.finalize(), MyClass, "Finalizing this new factory returns the same class.");
  
});

test("Class inheritance", function(){
  
  var MyClass = (new Class).finalize();
  var myInstance = new MyClass;
  
  ok(myInstance instanceof Class, "A new class instance is an instance of Class.");
  ok(myInstance instanceof Object, "Any class is an instance of Object.");
  
  var MySubClass = (new Class).extend(MyClass).finalize();
  var myInstance = new MySubClass;
  
  ok(myInstance instanceof MyClass, "An extended class instance is an instance of the parent class.");
  ok(myInstance instanceof MySubClass, "An extended class instance is an instance of its own class.");
  
});

test("Constructors", function(assert){
  
  var MyClass = (new Class).finalize();
  var MyOtherClass = (new Class).finalize();
  
  ok(MyClass !== MyOtherClass, "New classes do not share constructors.");
  
  var myConstructor = function(name){
    this.name = name;
  }
  
  MyClass = (new ClassFactory(MyClass)).construct(myConstructor).finalize();
  
  assert.equal(myConstructor, MyClass, "Setting a new constructor turns the class into it.");
  
});

test("Members", function(assert){
  
  var MyClass = (new Class).members({foo: 'bar'}).finalize();
  
  assert.equal(MyClass.prototype.foo, 'bar', "Members reside in the prototype of the finalized class.");
  
  MyClass = (new ClassFactory(MyClass)).members({nyerk: 'snarl'}).finalize();
  
  assert.equal(MyClass.prototype.nyerk, 'snarl', "Additional members can be added at a later point.");
  assert.equal(MyClass.prototype.foo, 'bar', "Old members are kept when additional members are added.");
  
  MyClass = (new ClassFactory(MyClass)).construct(function(){}).finalize();
  
  assert.equal(MyClass.prototype.foo, 'bar', "Members are transferred onto a new constructor when given.");
  
  var myInstance = new MyClass;
  
  assert.equal(myInstance.foo, 'bar', "Members are present in instances of the class.");
  ok( ! myInstance.hasOwnProperty('foo') , "Members are not directly present in instances.");
  
  var MyParentClass = (new Class).members({nyerk: 'snarl'}).finalize();
  MyClass = (new ClassFactory(MyClass)).extend(MyParentClass).finalize();
  myInstance = new MyClass;
  
  assert.equal(myInstance.nyerk, 'snarl', "Assigning a parent class gives instances its members.");
  assert.equal(myInstance.foo, 'bar', "Assigning a parent class does not override own members.");
  
});

test("Static members", function(assert){
  
  var MyClass = (new Class)
  
  .statics({
    foo: 'bar'
  })
  
  .finalize();
  
  assert.equal(MyClass.foo, 'bar', "Statics reside in the finalized class.");
  
  MyClass = (new ClassFactory(MyClass)).construct(function(){}).finalize();
  
  assert.equal(MyClass.foo, 'bar', "Statics are transferred onto a new constructor when given.");
  
});

test("Practical implementation.", function(assert){
  
  var Animal = (new Class)
  
  .construct(function(gender){
    this.gender = gender;
  })
  
  .statics({
    MALE: 1,
    FEMALE: 2
  })
  
  .members({
    gender: null
  })
  
  .finalize();
  
  var Dog = (new Class).extend(Animal)
  
  .construct(function(){
    Animal.apply(this, arguments);
  })
  
  .members({
    bark: function(){alert('Woof!')}
  })
  
  .finalize();
  
  var myDog = new Dog(Animal.MALE);
  
  //TESTS:
  ok(myDog instanceof Dog, "myDog Is an instance of Dog.");
  ok(myDog instanceof Animal, "myDog Is an instance of Animal.");
  ok(myDog.gender, "myDog Has a gender.");
  
});
