const chars = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ~='
const charsArr = chars.split('')
const radix = chars.length

const encodeNum = num => {
  if (num === undefined || !num instanceof Number) throw Error('not a number')

  let isPositive = num > 0,
    numString = `${num}`,
    arr = []

  let numArr = numString.split('.')
  let integerPart = Math.abs(numArr[0]),
    decimalPart = numArr[1] ? Number(`0.${numArr[1]}`) : null

  do {
    mod = integerPart % radix;
    integerPart = (integerPart - mod) / radix;
    arr.unshift(chars[mod]);
  } while (integerPart);

  if (decimalPart) {
    arr.push('.')
    let i = 0;
    while (i < 24) {
      let _decimalPart = decimalPart * radix
      let decArr = `${_decimalPart}`.split('.')
      arr.push(chars[decArr[0]])
      if (decArr[1] === 0) break
      decimalPart = decArr[1] ? Number(`0.${decArr[1]}`) : 0
      i++
    }
  }

  let str = isPositive ? arr.join('') : '-' + arr.join('')
  return str
}


const decodeNum = numCode => {
  if (numCode === undefined) return null

  let _numCode = String(numCode),
    i = 0,
    j = 0,
    intNum = 0,
    decNum = 0
  let idx = _numCode.indexOf('-')
  _numCode = idx > -1 ? _numCode.slice(1) : _numCode
  let numArr = _numCode.split('.')
  let integerPart = numArr[0],
    decimalPart = numArr[1] ? numArr[1] : null
  let intLen = integerPart.length
  let partLen = decimalPart ? decimalPart.length : 0

  while (i < intLen) {
    intNum += Math.pow(radix, i++) * chars.indexOf(integerPart.charAt(intLen - i) || 0);
  }

  if (decimalPart) {
    while (j < partLen) {
      decNum += Math.pow(64, -j) * (chars.indexOf(decimalPart.charAt(j) || 0) / 64);
      j++
    }
  }
  let totalNum = decimalPart ? intNum + decNum : intNum

  idx > -1 ? -totalNum : totalNum
  return totalNum

}

let num = 64.12
console.log('num--->', num)
let a = encodeNum(num)
console.log('a-->', a)

let b = decodeNum(a)
console.log('b--->', b)