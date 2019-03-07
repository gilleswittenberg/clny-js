const {
  anythingExcept,
  many,
  str,
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


const possiblyWrapped = (parser, bracketType = "PARENS", whitespace = true) => {
  const brackets = {
    "PARENS": ["(", ")"],
    "SQUARE": ["[", "]"],
    "CURLY" : ["{", "}"],
    "ANGLE" : ["<", ">"],
  }
  if (brackets[bracketType] == null) throw "Invalid bracketType"
  const [l, r] = brackets[bracketType]
  const constructParser = s => {
    const p = str(s)
    return whitespace ? whitespaced(p) : p
  }
  const left = constructParser(l)
  const right = constructParser(r)
  return choice([
    between(left)(right)(parser),
    parser
  ])
}

const wrappedInParentheses = parser => possiblyWrapped(parser)
const wrappedInCurlyBraces = parser => possiblyWrapped(parser, "CURLY")

module.exports = {
  anyChar,
  anyChars,
  anyCharExceptEOL,
  anyCharsExceptEOL,
  escapedBackslash,
  wrappedInParentheses,
  wrappedInCurlyBraces
}
