const {
  digit,
  sequenceOf,
  many,
  possibly,
  choice,
  anyOfString,
  pipeParsers,
  mapTo
} = require("arcsecond")

const {
  minus,
  plus,
  dot,
  underscore
} = require("../../convenience/tokens")

const charsToString = require("../../../utils/charsToString")
const Number = require("../../../tree/expressions/scalars/Number")

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
  mapTo(([f, cs]) => charsToString(f, cs))
])

const float = pipeParsers([
  sequenceOf([int, dot, int]),
  mapTo(([n, dot, n1]) => charsToString(n, dot, n1))
])

const numberPrefix = choice([minus, plus])

const prefixedInt = pipeParsers([
  sequenceOf([
    possibly(numberPrefix),
    int
  ]),
  mapTo(([prefix, value]) => charsToString(prefix, value))
])

const scientific = pipeParsers([
  sequenceOf([
    choice([
      float,
      int
    ]),
    anyOfString("eE"),
    prefixedInt
  ]),
  mapTo(([n,,n1]) => charsToString(n, "e", n1))
])

const number = pipeParsers([
  choice([
    scientific,
    float,
    int
  ]),
  mapTo(number => new Number(null, number))
])

module.exports = number
