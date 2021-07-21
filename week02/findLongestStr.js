const findLongestStr= (str) => {
  _str=str.trim()
  if (!_str) return '未输入字符'

  let tmp= '', longestStr= ''

  const handleData= () => {
    if(tmp.length > longestStr.length) {
      longestStr= tmp
    }
  }

  for(let i= 0; i < _str.length; i++) {
    let idx= tmp.indexOf(_str[i])
    if (idx > -1) {
      handleData()
      tmp= _str[i]
    } else {
      tmp += _str[i]
      if (i == _str.length - 1) {
        handleData()
      }
    }
  }
  return longestStr
}
