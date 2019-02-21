const {
  digits,
  sequenceOf,
  possibly,
  choice,
  anyOfString,
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

const parseNumber = (...parts) => parseFloat(parts.join(""))

const numberPrefix = choice([minus, plus])

// @TODO: underscored thousands (1_000_000)
const int = pipeParsers([digits, mapTo(n => parseInt(n))])

// @TODO: possibly trailing digits e.g. (5. = 5)
const floatParser = sequenceOf([digits, dot, digits])
const float = pipeParsers([floatParser, mapTo(([n,,n1]) => parseNumber(n, ".", n1))])

const numberLiteral = pipeParsers([
  sequenceOf([
    possibly(numberPrefix),
    choice([float, int])
  ]),
  mapTo(([prefix, value]) => parseNumber(prefix, value))
])

const e = anyOfString("eE")
const scientific = pipeParsers([
  sequenceOf([
    numberLiteral,
    e,
    pipeParsers([
      sequenceOf([
        possibly(numberPrefix),
        int
      ]),
      mapTo(([prefix, value]) => parseNumber(prefix, value))
    ])
  ]),
  mapTo(([m,,n]) => parseNumber(m + "e" + n))
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

const number = choice([arithmatic, scientific, numberLiteral])

module.exports = number
