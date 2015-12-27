proto = {a: 1, b: 2}
descendent = Object.create(proto)
document.writeln("descendent has proto's props: a=" + descendent.a + " b=" + descendent.b);
descendent.c = 4
document.writeln("plus its own: c=" + descendent.c);
document.writeln("can delete its own properties with delete operator");
delete descendent.c
document.writeln("c is now " + descendent.c);
document.writeln("can't delete ancestor properties");
delete descendent.b
delete descendent.a
document.writeln("descendent still has proto's props: a=" + descendent.a + " b=" + descendent.b);

