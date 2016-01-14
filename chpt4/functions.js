// Fuction literal
var add = function(a, b) {
  return a + b;
}

// functions don't give errors if you don't give the right number of arguments
console.log(add(2,3,4)); // 5
console.log(add()); //NaN - no error, you just added undefined to undefined

// functions within other functions:
//
var outer = function() {
  var a = 1;
  var inner = function() {
    var b = 2;
    console.log("outer variable 'a' + inner variable 'b' = " + (a + b)); // CLOSURE gives inner function access to a
  }(); // immediate invocation
  //outer function doesn't have access to inner variables:
  //console.log(b); would generate Uncaught ReferenceError
} 

outer(); 

// +++++++++++++++++++++++ Four Invocation Patterns  ++++++++++++++++++++
// functions are passed `this` and `arguments`
// value of `this` is determined by invocation pattern:
// one of: method, function, constructor, apply

// ******** Method Invocation Pattern **********
// methods are functions stored as property of object. `this` is bound to that
// object when the method is invoked:
//
var myObject = {
  value: 0,
  increment: function(incr) {
    this.value += typeof incr === 'number' ? incr : 1;
    //binding of this only happens at INVOCATION time
  }
};

myObject.increment();
console.log(myObject.value); // 1
myObject.increment(2);
console.log(myObject.value); // 3

// *********** Function Invocation Pattern **************
// function that is not the property of an object is invoked as a function:

var sum = add(3, 4);
console.log(sum);

//inside `add`, `this` is bound to the global object - EVEN IF IT IS INVOKED
//INSIDE ANOTHER FUNCTION. Inner functions inside a method will not have access
//to the parent object's properties through `this`!
//
//conventional workaround: method defines `that` and assigns it the value of 
//`this`. Then the object's properties are available to the inner function
//through `that`.

myObject.double = function() {
  var that = this; // Workaround
  var helper = function() {
    that.value = add(that.value, that.value) // access object properties through that
  };
  helper(); // invoking helper as a function means that THIS is the global object, hence the use of that
};

// ************* Constructor Invocation Pattern ***********
// `new` prefix binds function's `this` property to a new object with a link to
// the function's `prototype` member.
//

// by convention capitalise a function name if it is intended to be used with
// `new`. Bad things can happen if constructor functions are invoked without
// new.
var Quo = function(string) { //remember, Quo is a function which is an object, it has a prototype
  this.status = string;
};


// adding a method to Quo's prototype adds it to all instances of Quo
Quo.prototype.get_status = function() {return this.status;};

// this makes an instance of Quo, with a link to the prototype where we defined
// get_status:
var myQuo = new Quo("confused");

console.log(myQuo.get_status()); // "confused"

// all of the above is a sick joke by Javascript, don't use this style of
// constructor function.

// ************ Apply Invocation Pattern ***********
// functions are objects therefore functions can have methods
//
// `apply` method on function object lets us construct an array of arguments to
// use to invoke the function. Can set `this` inside the function to whatever
// we want.

var array = [3, 4];
var sum = add.apply(null, array); //first argument is the value for `this`, 2nd is array of parameters passed to function `add`
console.log(sum); // 7

var statusObject = {status: 'A-OK'};
// statusObject doesn't inherit from Quo.prototype, so it doesn't have get_status
// But we can use the get_status function from Quo.prototype by binding it to
// statusObject:

console.log(Quo.prototype.get_status.apply(statusObject)); // get_status sees statusObject as `this` and returns its status property

// +++++++++++++++++ Arguments +++++++++++++++++++++++++
// All functions are supplied with an `arguments` array
// includes all normal parameters plus any that were passed unasked

// function with variable arguments:
//
var sum = function () {
  var i, sum = 0;
  // warning: arguments has a length property but isn't an array
  // lacks all of the array methods
  for (i = 0; i < arguments.length; i += 1) {
    sum += arguments[i];
  }
  return sum;
}

console.log("sum of 3,4,5,6,7,8,9 is: " + sum(3,4,5,6,7,8,9))

// +++++++++++++++++ Return ++++++++++++++++++++++++++++
// return statement causes function to return control to caller earlier than
// the closing brace.
//
// If no return value is specified, `undefined` is returned
//
var no_return = function() {};

console.log(no_return()); //undefined

// if the `new` prefix is used without an object being returned then `this`
// is returned instead

var MyConstructor = function() {
  this.is_this_this = true;
}

var myObject = new MyConstructor();
console.log(myObject); // no return value, but the `this` that was inside myObject is returned
console.log(myObject.is_this_this) // true because is_this_this is available to myObject

// +++++++++++++++++ Exceptions +++++++++++++++++++++++
//

var add = function(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    // throw should be given a name and a descriptive message
    // (but since it's just an object it probably doesn't HAVE to
    //  ... and other properties can be added)
    throw {
      name: 'TypeError',
      message: 'add needs numbers'
    };
  }
  return a + b;
}

var try_it = function() {
  try{
    add("seven");
  } catch(e) {
    console.log(e.name + ': ' + e.message);
  }
}();

// ++++++++++++++++++ Augmenting Types +++++++++++++++++
// Adding a method to a prototype makes it available to all objects that inherit
// from it. Can add methods to functions, arrays, strings, numbers etc. etc.

// add a method named `method` to every function
Function.prototype.method = function(name, func) {
  this.prototype[name] = func; // add a property identified by `name` which has `func` as a value
  return this;
};

// with `method` method on Function.prototype we can do some useful stuff 
// without the ugliness of working through the `prototype` property.
//
// Extract just the integer part of a number:
Number.method('integer', function () {
  // depending on the sign of the number, call `ceil` or `floor` from Math on this this number
  return Math[this < 0 ? 'ceil' : 'floor'](this); 
});

console.log((-10 / 3).integer()); // -3

// remove spaces from the ends of a string:
String.method('trim', function () {
  return this.replace(/^\s+|\s+$/g, '');
});

console.log('"' + "       neat       ".trim() + '"'); // "neat"

// Note that because of dynamic prototypal inheritance even objects that already
// existed will be given  anything created on their prototype even if it is created
// after the object where they are used

// Care must be taken when mixing libraries. Can make method method check if
// a method with the same name exists before defining it:

Function.prototype.method = function(name, func) {
  if (!this.prototype[name]) {
    this.prototype[name] = func;
    return this;
  }
}
