/* eslint-disable */

const numArray = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín']

function ReadDozens (num, daydu) {
  let string = ''
  let dozen = Math.floor(num / 10)
  let unit = num % 10
  if (dozen > 1) {
    string = ` ${numArray[dozen]} mươi`
    if (unit === 1) {
      string += ' mốt'
    }
  } else if (dozen === 1) {
    string = ' mười'
    if (unit === 1) {
      string += ' một'
    }
  } else if (daydu && unit > 0) {
    string = ' lẻ'
  }
  if (unit === 5 && dozen >= 1) {
    string += ' lăm'
  } else if (unit > 1 || (unit === 1 && dozen === 0)) {
    string += ` ${numArray[unit]}`
  }
  return string
}

function ReadBlock (num, daydu) {
  let string = ''
  let hundred = Math.floor(num / 100)
  num = Math.round(num % 100)
  if (daydu || hundred > 0) {
    string = ` ${numArray[hundred]} trăm`
    string += ReadDozens(num, true)
  } else {
    string = ReadDozens(num, false)
  }
  return string
}

function ReadMillions (num, daydu) {
  let string = ''
  let million = Math.floor(num / 1000000)
  let num1 = num % 1000000
  if (million > 0) {
    string = `${ReadBlock(million, daydu)} triệu`
    daydu = true
  }
  let thousand = Math.floor(num1 / 1000)
  let num2 = num1 % 1000
  if (thousand > 0) {
    string += `${ReadBlock(thousand, daydu)} nghìn`
    daydu = true
  }
  if (num2 > 0) {
    string += ReadBlock(num2, daydu)
  }
  return string
}

function ReadEnglish (n) {
  if (n === 0) return 'zero'
  let a = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
  let b = ['', '', 'twenty', 'thirty', 'fourty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
  let g = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion']
  let grp = (k) => (`000${k}`).substr(-3)
  let rem = (m) => m.substr(0, m.length - 3)
  let fmt = (_ref) => {
    let h = _ref[0]
    let t = _ref[1]
    let o = _ref[2]
    return [Number(h) === 0 ? '' : `${a[h]} hundred `, Number(o) === 0 ? b[t] : b[t] ? `${b[t]}-` : '', a[t + o] || a[o]].join('')
  }
  let cons = (xs) => (x) => (y) => x ? [x, y ? ` ${y}` : '', ' ', xs].join('') : xs
  let iter = (str) => (i) => (x) => (r) => {
    if (x === '000' && r.length === 0) return str
    return iter(cons(str)(fmt(x))(g[i]))(i + 1)(grp(r))(rem(r))
  }
  return iter('')(0)(grp(String(n)))(rem(String(n)))
}

function ReadVietnamese (num) {
  if (num === 0) {
    return numArray[0]
  }
  let string = ''
  let hauto = ''
  let billion
  do {
    billion = num % 1000000000
    num = Math.floor(num / 1000000000)
    if (num > 0) {
      string = ReadMillions(billion, true) + hauto + string
    } else {
      string = ReadMillions(billion, false) + hauto + string
    }
    hauto = ' tỷ'
  } while (num > 0)
  return string
}

export { ReadEnglish, ReadVietnamese }