stooge = {is_stooge: true};
if (typeof Object.mycreate !== 'function') {
  Object.mycreate = function(o) {
    var F = function() {};
    F.prototype = o;
    return new F();
  };
}
var another_stooge = Object.mycreate(stooge);
another_stooge.is_another_stooge = true;
document.writeln("another stooge with inherits from stooge prototype, has_stooge is:" + another_stooge.is_stooge);
document.writeln(
    "prototype does not get newly defined properties on new sub-object, as demonstrated by not having is_another_stooge property:" + (stooge.is_another_stooge === undefined));
document.writeln("hasOwnProperty tells you if property is on object, but ignoring prototype chain");
document.writeln("another_stooge is_stooge: " + another_stooge.is_stooge + " but it does it have it as own property?: " + another_stooge.hasOwnProperty('is_stooge'));

