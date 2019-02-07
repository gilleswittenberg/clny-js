const {
  pipeParsers,
  str,
  mapTo,
  choice,

  // tests
  parse,
  toValue
} = require("arcsecond")
const assert = require("assert").strict

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

assert.equal(toValue(parse(boolean)("false")), false)
assert.equal(toValue(parse(boolean)("true")), true)
