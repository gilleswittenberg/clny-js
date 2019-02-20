const {
  digits,
  sequenceOf,
  possibly,
  choice,
  pipeParsers,
  mapTo,
} = require("arcsecond")

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
