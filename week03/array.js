let arr= [1, 2, 3, 4, 5, 6]
const fn= (n, arr) => {
  if (Array.isArray(arr)) {
    if (n > arr.length) throw Error('超出数组长度')
    arr.sort((a,b) =>b - a)
    console.log('arr--->', arr)
    return arr[n-1]
  }
  throw Error('arr is not array')
}

let result= fn(2, arr)
console.log('result---->', result)