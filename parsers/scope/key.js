const {
  letters,
  regex,
  sequenceOf,
  possibly,
  pipeParsers,
  mapTo,

  // tests
  parse,
  toValue
} = require("arcsecond")
const assert = require("assert").strict

const lowercase = regex(/^[a-z]/)
const key = pipeParsers([
  sequenceOf([
    lowercase,
    possibly(letters)
  ]),
  mapTo(([first, chars]) => first + (chars ? chars : ""))
])

module.exports = key

assert.equal(toValue(parse(key)("k")), "k")
assert.equal(toValue(parse(key)("camelCase")), "camelCase")
