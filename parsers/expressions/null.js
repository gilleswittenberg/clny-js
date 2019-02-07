const {
  pipeParsers,
  str,
  mapTo,

  // tests
  parse,
  toValue
} = require("arcsecond")
const assert = require("assert").strict

const nullParser = pipeParsers([
  str("null"),
  mapTo(() => null)
])

module.exports = nullParser

assert.equal(toValue(parse(nullParser)("null")), null)
