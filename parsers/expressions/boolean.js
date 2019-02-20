const {
  pipeParsers,
  str,
  mapTo,
  choice,
} = require("arcsecond")

const falseString = "false"
const trueString = "true"
const pFalse = str(falseString)
const pTrue = str(trueString)

const boolean = pipeParsers([
  choice([
    pFalse,
    pTrue
  ]),
  mapTo(chars => {
    if (chars === falseString) return false
    if (chars === trueString) return true
  })
])

module.exports = boolean
