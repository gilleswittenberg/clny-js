const {
  pipeParsers,
  sequenceOf,
  str,
  mapTo,
  many,
  choice,
  anythingExcept,
} = require("arcsecond")

const {
  doubleQuote
} = require("../convenience/tokens")

const {
  newline
} = require("../convenience/whitespace")

const charsToString = require("../../utils/charsToString")
const Expression = require("../../tree/Expression")

const escapedQuote = str(`\\"`) // eslint-disable-line quotes

const string = pipeParsers([
  sequenceOf([
    doubleQuote,
    pipeParsers([
      many(choice([
        escapedQuote,
        anythingExcept(
          choice([
            doubleQuote,
            newline
          ])
        )
      ])),
      mapTo(charsToString)
    ]),
    choice([
      doubleQuote,
      newline
    ])
  ]),
  mapTo(([,s, closingChar]) => {
    const shouldTrimEnd = closingChar !== "\""
    const str = shouldTrimEnd ? s.trimEnd() : s
    return new Expression(str, "String")
  })
])

module.exports = string
