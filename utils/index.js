export const dynamicsort = (property, order) => {
  let sortOrder = 1
  if (order === 'desc') {
    sortOrder = -1
  }
  return function (a, b) {
    // a should come before b in the sorted order
    if (a[property] < b[property]) {
      return -1 * sortOrder
      // a should come after b in the sorted order
    } else if (a[property] > b[property]) {
      return 1 * sortOrder
      // a and b are the same
    } else {
      return 0 * sortOrder
    }
  }
}

export function toFixed(x) {
  if (Math.abs(x) < 1.0) {
    const e = parseInt(x.toString().split('e-')[1])
    if (e) {
      x *= Math.pow(10, e - 1)
      x = '0.' + new Array(e).join('0') + x.toString().substring(2)
    }
  } else {
    let e = parseInt(x.toString().split('+')[1])
    if (e > 20) {
      e -= 20
      x /= Math.pow(10, e)
      x += new Array(e + 1).join('0')
    }
  }
  return x
}

export function countDecimals(value) {
  if (!value) return ''
  const text = value.toString()
  let val = 0

  if (typeof value === 'string') {
    val = Number(value)
  }

  // verify if number 0.000005 is represented as "5e-6"
  if (text.includes('e-')) {
    // eslint-disable-next-line no-unused-vars
    const [base, trail] = text.split('e-')
    const deg = parseInt(trail, 10)
    return deg
  }
  // count decimals for number in representation like "0.123456"
  if (Math.floor(val) !== val) {
    return val.toString().split('.')[1].length || 0
  }
  return 0
}
