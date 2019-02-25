const {
  pipeParsers,
  sequenceOf,
  str,
  mapTo,
  many,
  choice,
  anythingExcept
} = require("arcsecond")

const {
  doubleQuote,
  plus
} = require("../convenience/tokens")

const {
  newline,
  whitespaced
} = require("../convenience/whitespace")

const charsToString = require("../../utils/charsToString")
const Expression = require("../../tree/Expression")
const StringConcatenation = require("../../tree/StringConcatenation")

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

const stringConcatenation = pipeParsers([
  sequenceOf([
    string,
    whitespaced(plus),
    string,
    many(
      pipeParsers([
        sequenceOf([
          whitespaced(plus),
          string
        ]),
        mapTo(([,str]) => str)
      ])
    )
  ]),
  mapTo(([str,,str1, additional]) => new StringConcatenation([str, str1].concat(additional)))
])

module.exports = {
  string,
  stringConcatenation
}
