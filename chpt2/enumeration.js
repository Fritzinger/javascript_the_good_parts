document.writeln("ENUMERATION");
obj = {a: 1, b: 2, c: 3, d: 4};
obj.e = function() {
  console.log("function called!");
}
obj.a = 17;
document.writeln("for .. in enumerates objects of property:");
for (name in obj) {
  if (typeof obj[name] !== 'function') {
    document.writeln(name + ': ' + obj[name]);
  } else {
    document.writeln("typeof operator allows us to check whether we are evaluating a function (e.g. don't want to print it like other values)");
    document.writeln("for interests sake, what happens if we do try print the function:");
    document.writeln(name + ': ' + obj[name]);

  }
}
document.writeln("N.B. enumeration doesn't guarantee order of keys");
