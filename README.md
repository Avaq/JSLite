# JSLite - Version 0.6.2 Beta

## Introduction

A very light-weight JavaScript library aiming to make some trivial tasks in JavaScript
relating to object oriented programming easier to write and read.

## Features

### Classes

Yes, this is another JavaScript library that offers functionality for creating classes.
However, this one is made not to get in your way. *At all*. Classes created using these
tools are simple, pure JavaScript objects without bells and whistles. No magic 
`init`-method, little wrapped constructors, no glitchy `super()` method.

The way class-hierarchy is maintained, is through the automatically maintained
`constructor` property on every class instance, and `parent` property on every class.

All created classes will automatically be children of the `Class` class, which contains
functionality for class-oriented programming, but no magic nonsense.

Here's an example of what creating classes looks like:

```js
//Create the Dog class. It extends an imaginary Animal class.
var Dog = (new JSLite.Class).extend(Animal)

//Create a constructor.
.construct(function(name){
  Dog.dogs.push(this);
  this.name = name;
  Animal.call(this); //Or: `this.construct()`
})

//Add static members.
.statics({
  dogs: []
})

//Add instance members.
.members({
  name: "StrayDog",
  bark: function(){
    console.log("Woof!");
  }
})

//Finalize the class to turn it into a native JavaScript object.
.finalize();
```

The class can then be instantiated.

```js
//Create my dog.
var myDog = new Dog("Scoobie");

//Woof!
myDog.bark();

//All true.
(myDog instanceof Class);
(myDog instanceof Animal);
(myDog instanceof Dog);
(myDog.constructor == Dog);
(myDog == Dog.dogs[0]);
(myDog.name == "Scoobie");

```

## Change-log

The changes can be found in `CHANGES.md` in this repository.

## License

Copyright (c) 2013 Avaq, https://github.com/Avaq

JSLite is licensed under the MIT license. The license is included as `LICENSE.md` in this
directory.
