const {
  anythingExcept,
  many,
  str
} = require("arcsecond")

const {
  newline,
  eol
} = require("./whitespace")

const anyChar = anythingExcept(newline)
const anyChars = many(anyChar)
const anyCharExceptEOL = anythingExcept(eol)
const anyCharsExceptEOL = many(anyCharExceptEOL)

const escapedBackslash = str("\\")

module.exports = {
  anyChar,
  anyChars,
  anyCharExceptEOL,
  anyCharsExceptEOL,
  escapedBackslash
}
