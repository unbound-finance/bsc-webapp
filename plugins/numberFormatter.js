// known SI prefixes, multiple of 3
// const PREFIXES = {
//   12: 'T',
//   9: 'B',
//   6: 'M',
//   3: 'K',
//   0: '',
// }

// function getExponent(n) {
//   if (n === 0) return 0

//   return Math.floor(Math.log10(Math.abs(n)))
// }

// function precise(n) {
//   return Number.parseFloat(n.toPrecision(4))
// }

// function toHumanString(sn) {
//   const n = precise(Number.parseFloat(sn))
//   let e = Math.min(Math.floor(getExponent(n)), 6)

//   if (e % 2 === 0) e -= 1
//   if (e < 2) e = 0

//   return precise(n / Math.pow(10, e)).toString() + PREFIXES[e]
// }

function abbreviateNumber(value) {
  let newValue = value
  if (value >= 1000) {
    const suffixes = ['', 'k', 'm', 'b', 't']
    const suffixNum = Math.floor(('' + value).length / 3)
    let shortValue = ''
    for (let precision = 2; precision >= 1; precision--) {
      shortValue = parseFloat(
        (suffixNum !== 0
          ? value / Math.pow(1000, suffixNum)
          : value
        ).toPrecision(precision)
      )
      const dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '')
      if (dotLessShortValue.length <= 2) {
        break
      }
    }
    if (shortValue % 1 !== 0) shortValue = shortValue.toFixed(1)
    newValue = shortValue + suffixes[suffixNum]
  }
  return newValue
}

export default (_, inject) => {
  inject('numberFormatter', abbreviateNumber)
}
