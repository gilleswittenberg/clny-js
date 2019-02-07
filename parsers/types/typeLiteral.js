const {
  letters,
  regex,
  pipeParsers,
  sequenceOf,
  possibly,
  mapTo,

  // tests
  parse,
  toValue
} = require("arcsecond")
const assert = require("assert").strict

const uppercase = regex(/^[A-Z]/)
const typeLiteral = pipeParsers([
  sequenceOf([
    uppercase,
    possibly(letters)
  ]),
  mapTo(([first, chars]) => first + (chars ? chars : ""))
])

module.exports = typeLiteral

assert.equal(toValue(parse(typeLiteral)("K")), "K")
assert.equal(toValue(parse(typeLiteral)("Capitalized")), "Capitalized")
