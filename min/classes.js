/**
 * JSLite compressed.
 * 
 * This version contains:
 * - JSlite.js
 * - ClassFactory.js
 * 
 * @author Avaq <aldwin.vlasblom@gmail.com>, https://github.com/Avaq
 * 
 */
;(function(e,t){function n(e){this.message=e||this.message}n.prototype={name:"JSLiteException",message:"An error occurred in JSLite."};e.JSLite={};e.JSLite.JSLiteException=n})(this||window);(function(e){"use strict";function n(e){var n,r,i=Array.prototype.slice.call(arguments,1);for(n in i){if(t.call(i,n)){for(r in i[n]){if(t.call(i[n],r)){e[r]=i[n][r]}}}}return e}function r(e){var n;for(n in e){if(t.call(e,n)){return true}}return false}function i(e){this._class=e}function s(){var e=function(){};e.prototype=Object.create(s.prototype);return new i(e)}var t=Object.prototype.hasOwnProperty;i.prototype={extend:function(e){this._class.prototype=n(Object.create(e.prototype),this._class.prototype);return this},construct:function(e){e.prototype=this._class.prototype;n(e,this._class);this._class=e;return this},members:function(e){if(r(this._class.prototype)){n(this._class.prototype,e)}else{this._class.prototype=e}return this},statics:function(e){n(this._class,e);return this},finalize:function(){return this._class}};e.JSLite.ClassFactory=i;e.JSLite.Class=s})(this||window);
