const {
  digit,
  sequenceOf,
  many,
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
  dot,
  underscore
} = require("../convenience/tokens")

const {
  whitespaced
} = require("../convenience/whitespace")

const charsToString = require("../../utils/charsToString")
const Expression = require("../../tree/Expression")
const Arithmetic = require("../../tree/Arithmetic")

const numberPrefix = choice([minus, plus])

const int = pipeParsers([
  sequenceOf([
    digit,
    many(
      choice([
        underscore,
        digit
      ])
    )
  ]),
  mapTo(([f, cs]) => f + charsToString(cs))
])

const prefixedInt = pipeParsers([
  sequenceOf([
    possibly(numberPrefix),
    int
  ]),
  mapTo(([prefix, value]) => (prefix || "") + value)
])

const float = pipeParsers([
  sequenceOf([int, dot, int]),
  mapTo(([n, dot, n1]) => n + dot + n1)
])

const numberLiteral = pipeParsers([
  sequenceOf([
    possibly(numberPrefix),
    choice([float, int])
  ]),
  mapTo(([prefix, value]) => (prefix || "") + value)
])

const numberLiteralExpression = pipeParsers([
  numberLiteral,
  mapTo(str => new Expression(str, "Number"))
])

const e = anyOfString("eE")
const scientific = pipeParsers([
  sequenceOf([
    numberLiteral,
    e,
    prefixedInt
  ]),
  mapTo(([n,, n1]) => new Expression(n + "e" + n1, "Number"))
])

const operator = choice([plus, minus, asterisk, slash])
const arithmetic = pipeParsers([
  sequenceOf([
    numberLiteralExpression,
    whitespaced(operator),
    numberLiteralExpression
  ]),
  mapTo(([left, operator, right]) => new Arithmetic(left, right, operator))
])

const number = choice([
  arithmetic,
  scientific,
  numberLiteralExpression
])

module.exports = {
  numberLiteral,
  number
}
