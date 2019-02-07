const {
  pipeParsers,
  sequenceOf,
  str,
  mapTo,
  many,
  choice,
  anythingExcept,

  // tests
  parse,
  toValue
} = require("arcsecond")
const assert = require("assert").strict

const {
  doubleQuote
} = require("../convenience/tokens")

const {
  newline
} = require("../convenience/whitespace")

const charsToString = require("../../utils/charsToString")

const escapedQuote = str(`\\"`)

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
    return shouldTrimEnd ? s.trimEnd() : s
  })
])

module.exports = string

assert.equal(toValue(parse(string)(`"Abc"`)), "Abc")
assert.equal(toValue(parse(string)(`"D\\""`)), `D\\"`)

assert.equal(toValue(parse(string)(`"AB\n`)), "AB")
assert.equal(toValue(parse(string)(`"Abcd   \n`)), "Abcd")
assert.equal(toValue(parse(string)(`" Abcd e \n`)), " Abcd e")
