let str = 'f(5+(4/(9+1)))'
let reg = /f\((\d)([+|-|*|/])\((\d)([+|-|*|/])\((\d)([+|-|*|/])(\d)\)\)\)/
let res = reg.exec(str)
console.log('res--->', res)
const handle = (a, b, type) => {
  switch (type) {
    case "+":
      return Number(a) + Number(b)
    case "-":
      return Number(a) - Number(b)
    case "*":
      return Number(a) * Number(b)
    case "/":
      return Number(a) / Number(b)
  }
}

let result = handle(res[1], handle(res[3], handle(res[5], res[7], res[6]), res[4]), res[2])
console.log('result--->', result)