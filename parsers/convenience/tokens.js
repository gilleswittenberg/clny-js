const {
  char,
  str
} = require("arcsecond")

// tokens (ASCII)
const space = char(" ")
const tab = char("\t")
const dot = char(".")
const plus = char("+")
const comma = char(",")
const minus = char("-")
const asterisk = char("*")
const slash = char("/")
const colon = char(":")
const semicolon = char(";")
const doubleQuote = char("\"")
// @TODO: Rename to number
const numberSign = char("#")
const backslash = char("\\")
const leftParens = char("(")
const rightParens = char(")")
const pipe = char("|")

// multchar tokens
const arrow = str("->")

module.exports = {
  space,
  tab,
  dot,
  plus,
  comma,
  minus,
  asterisk,
  slash,
  colon,
  semicolon,
  doubleQuote,
  numberSign,
  backslash,
  leftParens,
  rightParens,
  pipe,

  arrow
}
