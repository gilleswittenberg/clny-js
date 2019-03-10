const {
  char,
  choice,
  between
} = require("arcsecond")

const {
  whitespaced
} = require("./whitespace")

const wrap = (parser, bracketType = "PARENS", whitespace = true) => {
  const brackets = {
    "PARENS": ["(", ")"],
    "SQUARE": ["[", "]"],
    "CURLY" : ["{", "}"],
    "ANGLE" : ["<", ">"]
  }
  if (brackets[bracketType] == null) throw "Invalid bracketType"
  const [l, r] = brackets[bracketType]
  const constructParser = s => {
    const p = char(s)
    return whitespace ? whitespaced(p) : p
  }
  const left = constructParser(l)
  const right = constructParser(r)
  return between(left)(right)(parser)
}

const optionalWrap = (parser, bracketType = "PARENS", whitespace = true) => {
  const wrapped = wrap(parser, bracketType, whitespace)
  return choice([
    wrapped,
    parser
  ])
}

const optionalWrappedInParentheses = parser => optionalWrap(parser)
const optionalWrappedInCurlyBraces = parser => optionalWrap(parser, "CURLY")

module.exports = {
  optionalWrappedInParentheses,
  optionalWrappedInCurlyBraces
}
