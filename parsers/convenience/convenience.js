const {
  anythingExcept,
  many,
  str,
  composeParsers,
  choice,
  between
} = require("arcsecond")

const {
  leftParens,
  rightParens
} = require("./tokens")

const {
  whitespaced,
  newline,
  eol
} = require("./whitespace")

const anyChar = anythingExcept(newline)
const anyChars = many(anyChar)
const anyCharExceptEOL = anythingExcept(eol)
const anyCharsExceptEOL = many(anyCharExceptEOL)

const escapedBackslash = str("\\")

const wrappedInParentheses = parser => choice([
  between(whitespaced(leftParens))(whitespaced(rightParens))(parser),
  parser
])

module.exports = {
  anyChar,
  anyChars,
  anyCharExceptEOL,
  anyCharsExceptEOL,
  escapedBackslash,
  wrappedInParentheses
}
