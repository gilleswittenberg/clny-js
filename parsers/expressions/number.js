const {
  digits,
  sequenceOf,
  possibly,
  choice,
  pipeParsers,
  mapTo,

  // tests
  parse,
  toValue
} = require("arcsecond")
const assert = require("assert").strict

const {
  minus,
  plus,
  asterisk,
  slash,
  dot
} = require("../convenience/tokens")

const {
  whitespaced
} = require("../convenience/whitespace")

const numberPrefix = choice([minus, plus])

// @TODO: underscored thousands (1_000_000)
const int = pipeParsers([digits, mapTo(n => parseInt(n))])

const floatParser = sequenceOf([digits, dot, digits])
const float = pipeParsers([floatParser, mapTo(([n,,n1]) => parseFloat(n + "." + n1))])

const numberLiteral = pipeParsers([
  sequenceOf([
    possibly(numberPrefix),
    choice([float, int])
  ]),
  mapTo(([prefix, value]) => {
    // @TODO: Clean up string to parser
    const isNegative = prefix === "-"
    return isNegative ? -value : value
  })
])

const operator = choice([plus, minus, asterisk, slash])
const arithmatic = pipeParsers([
  sequenceOf([
    numberLiteral,
    whitespaced(operator),
    numberLiteral
  ]),
  mapTo(([left, operator, right]) => {
    // @TODO: Clean up strings to parser
    switch (operator) {
      case "+":
        return left + right
      case "-":
        return left - right
      case "*":
        return left * right
      case "/":
        return left / right
    }
  })
])

const number = choice([arithmatic, numberLiteral])

module.exports = number

// int
assert.equal(toValue(parse(int)("5")), 5)
assert.equal(toValue(parse(int)("523")), 523)
//assert.throws(toValue(parse(int)("a")))

// float
assert.equal(toValue(parse(float)("1.2")), 1.2)

// negative numbers
assert.equal(toValue(parse(numberLiteral)("-9")), -9)
assert.equal(toValue(parse(numberLiteral)("-1.2")), -1.2)

// arithmatic
assert.equal(toValue(parse(arithmatic)("6 + 7")), 13)
assert.equal(toValue(parse(arithmatic)("6 - 7")), -1)
assert.equal(toValue(parse(arithmatic)("6 * 7")), 42)
assert.equal(toValue(parse(arithmatic)("6 / 2")), 3)
