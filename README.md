# JSLite - Version 0.1.0 Beta

## Introduction

A very light-weight JavaScript library aiming to make some trivial tasks in JavaScript
relating to object oriented programming easier to write and read.

## Features

### Classes

Yes, this is another JavaScript library that offers functionality for creating classes.
However, this one is made not to get in your way. *At all*. Classes created using these
tools are simple, pure JavaScript objects without bells and whistles. No magic 
`init`-method, no wrapped constructors, no glitchy `super()` method. Just JavaScript,
slightly more readable and manageable.

Here's an example of how creating classes looks like (Animal is an empty class used for
demonstrative purpose):

```js
//Create the Dog class. It extends the Animal class.
var Dog = (new JSLite.Class).extends(Animal)

//Create a constructor.
.construct(function(name){
  Dog.dogs.push(this);
  this.name = name;
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
(myDog == Dog.dogs[0]);
(myDog.name == "Scoobie");

```

## Change-log

The changes can be found in `CHANGES.md` in this repository.

## License

Copyright (c) 2013 Avaq, https://github.com/Avaq

JSLite is licensed under the MIT license. The license is included as `LICENSE.md` in this
directory.
