stooge = {};
document.writeln("created stooge as empty object");
var x = stooge;
document.writeln("assign stooge to var x");
x.nickname = 'Curly'
document.writeln("set nickname on x to " + x.nickname);
document.writeln("nickname is also assigned on stooge because x and stooge are references to the same object:" + stooge.nickname);
