/* ------------------
 * Ref types in scala.runtime._
 * ------------------ */

(function ($env) {
  var ObjectClass = $env.classes["java.lang.Object"].type;

  function createRefType(elemShortName, isVolatile, zero) {
    var isObject = elemShortName === "Object";
    var name = "scala.runtime." +
      (isVolatile ? "Volatile" : "") + elemShortName + "Ref";
    var elemTypeName = isObject ? "java.lang.Object" : "scala."+elemShortName;

    function Class() {
      ObjectClass.prototype.constructor.call(this);
      this[" elem"] = zero;
    }
    Class.prototype = Object.create(ObjectClass.prototype);
    Class.prototype.constructor = Class;

    Class.prototype["<init>("+elemTypeName+"):"+name] = function(elem) {
      ObjectClass.prototype["<init>():java.lang.Object"].call(this);
      this[" elem"] = elem;
      return this;
    }

    if (isObject) {
      Class.prototype["toString():java.lang.String"] = function() {
        return this[" elem"]["toString():java.lang.String"]();
      }
    } else {
      Class.prototype["toString():java.lang.String"] = function() {
        return $env.makeNativeStrWrapper(this[" elem"].toString());
      }
    }

    $env.createClass(name, Class, "java.lang.Object", {
      name: true,
      "java.io.Serializable": true,
      "java.lang.Object": true
    });
  }

  for (var volatile = 0; volatile < 2; volatile++) {
    var isVolatile = volatile != 0;
    createRefType("Boolean", isVolatile, false);
    createRefType("Char", isVolatile, 0);
    createRefType("Byte", isVolatile, 0);
    createRefType("Short", isVolatile, 0);
    createRefType("Int", isVolatile, 0);
    createRefType("Long", isVolatile, 0);
    createRefType("Float", isVolatile, 0.0);
    createRefType("Double", isVolatile, 0.0);
    createRefType("Object", isVolatile, null);
  }
})($ScalaJSEnvironment);