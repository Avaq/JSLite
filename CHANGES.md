#### [Version 0.4.0 Beta](https://github.com/Avaq/JSLite/tree/0.4.0-beta)
_12-Sep-2013_

* Added `MyClass._PARENT` to refer to the parent class.
* Added `ClassInstance.super()` to call a method on the parent class, despite it being
  overridden in the class that `super` is called on.
* Added `ClassInstance.getStatic()` to find a property in the static parent chain.
* Added `ClassInstance.callStatic()` to call a method in the static parent chain.
* Updated the minified version.

#### [Version 0.3.0 Beta](https://github.com/Avaq/JSLite/tree/0.3.0-beta)
_03-Sep-2013_

* Classes gain some standard properties from ClassFactory.
  - `classInstance._STATIC` will always refer to the constructor of the instance.
  - `classInstance.proxy()` is available on every instance through `Class.prototype`.
* Updated the minified version.

#### [Version 0.2.0 Beta](https://github.com/Avaq/JSLite/tree/0.2.0-beta)
_18-Jul-2013_

* Sub-classes now inherit their parent constructor as a default constructor.

#### [Version 0.1.1 Beta](https://github.com/Avaq/JSLite/tree/0.1.1-beta)
_15-Jul-2013_

* Fixed: Parent tree is lost when members are added to a child-class.

#### [Version 0.1.0 Beta](https://github.com/Avaq/JSLite/tree/0.1.0-beta)
_15-Jul-2013_

* First release.
