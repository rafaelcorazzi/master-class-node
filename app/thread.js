var a = 20;
  
function foo() {
      a = a + 1;
      return a;
}
  
function bar() {
      a = a * 2;
      return a;
}
  
  // ajax(..) é uma função Ajax arbitrária fornecida por uma biblioteca
console.log(bar());
console.log(foo());
