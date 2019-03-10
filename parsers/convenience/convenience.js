const {
  anythingExcept,
  many
} = require("arcsecond")

const {
  newline,
  eol
} = require("./whitespace")

const anyChar = anythingExcept(newline)
const anyChars = many(anyChar)
const anyCharExceptEOL = anythingExcept(eol)
const anyCharsExceptEOL = many(anyCharExceptEOL)

module.exports = {
  anyChar,
  anyChars,
  anyCharExceptEOL,
  anyCharsExceptEOL
}
