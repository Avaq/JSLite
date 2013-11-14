#### [Version 0.5.0 Beta](https://github.com/Avaq/JSLite/tree/0.5.0-beta)
_14-Nov-2013_

* Renamed `_STATIC` to `constructor`.
* Renamed `_PARENT` to `parent`.
* Added `Class.prototype.construct()` to call the constructor of the parent class.
* Added `Class.prototype.combine()` to get a merge of a property throughout the ancestor chain.
* Added `Class.prototype.combineStatic()` to get a merge of a property throughout the static ancestor chain.

#### [Version 0.4.0 Beta](https://github.com/Avaq/JSLite/tree/0.4.0-beta)
_12-Sep-2013_

* Added `MyClass._PARENT` to refer to the parent class.
* Added `Class.prototype.super()` to call a method on the parent class, despite it being
  overridden in the class that `super` is called on.
* Added `Class.prototype.getStatic()` to find a property in the static ancestor chain.
* Added `Class.prototype.callStatic()` to call a method in the static ancestor chain.
* Updated the minified version.

#### [Version 0.3.0 Beta](https://github.com/Avaq/JSLite/tree/0.3.0-beta)
_03-Sep-2013_

* Classes gain some standard properties from ClassFactory.
  - `class.prototype._STATIC` will always refer to the constructor of the instance.
  - `class.prototype.proxy()` is available on every instance through `Class.prototype`.
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
