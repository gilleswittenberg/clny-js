const {
  recursiveParser,
  pipeParsers,
  char,
  sepBy,
  sepBy1,
  many,
  sequenceOf,
  mapTo,

  // tests
  parse,
  toValue
} = require("arcsecond")
const assert = require("assert").strict

const { comma } = require("../convenience/tokens")
const { whitespaced } = require("../convenience/whitespace")

const {
  wrappedInParentheses
} = require("../convenience/convenience")

const assignment = require("./assignment")

const assignments = wrappedInParentheses(
  sepBy1(whitespaced(comma))(assignment)
)

module.exports = assignments

const single = toValue(parse(assignments)("k: 5"))

assert.equal(single.length, 1)
assert.equal(single[0].keys[0], "k")
assert.equal(single[0].expressions[0].value.value, 5)

const plural = toValue(parse(assignments)("l: 6, m: 7"))
assert.equal(plural.length, 2)
assert.equal(plural[0].keys[0], "l")
assert.equal(plural[0].expressions[0].value.value, 6)
assert.equal(plural[1].keys[0], "m")
assert.equal(plural[1].expressions[0].value.value, 7)

const pluralParens = toValue(parse(assignments)("(l: 6, m: 7)"))
assert.equal(pluralParens.length, 2)


// @TODO: "p: k: 7, l: 8" => p: (k: 7, l: 8)
// @TODO: "p: alias: k: 7, l: 8" => p: alias: (k: 7, l: 8)
// @TODO: "func: arg: Int -> {}" => func: (arg: Int) -> {}
//console.log(toValue(parse(assignments)("p: k: 7, l: 8")))
