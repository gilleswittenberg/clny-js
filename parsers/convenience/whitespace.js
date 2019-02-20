const {
  char,
  sequenceOf,
  possibly,
  many,
  choice,
  between
} = require("arcsecond")

const {
  space,
  minus,
  tab,
  semicolon
} = require("./tokens")

const times = require("./times")

const lf = char("\n")
const cr = char("\r")
const newline = sequenceOf([possibly(cr), lf])

const whitespace = many(choice([space, tab]))
const whitespaced = parser => between(whitespace)(whitespace)(parser)
const whitespaceAndNewline = many(choice([space, tab, newline]))
const whitespaceAndNewlined = parser => between(whitespaceAndNewline)(whitespaceAndNewline)(parser)
const eol = choice([
  whitespaceAndNewlined(semicolon),
  sequenceOf([whitespace, newline])
])
const indent = sequenceOf([space, space])
const dashedIndent = sequenceOf([minus, space])
const lastIndent = choice([indent, dashedIndent])
const indents = (num = 1) => {
  if (num <= 1) return lastIndent
  const indents = times(indent, num - 1)
  return sequenceOf([
    indents,
    lastIndent
  ])
}

module.exports = {
  newline,
  whitespace,
  whitespaced,
  whitespaceAndNewline,
  whitespaceAndNewlined,
  eol,
  indent,
  dashedIndent,
  indents
}
