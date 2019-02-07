const {
  str,

  // tests
  parse,
  toValue
} = require("arcsecond")
const assert = require("assert").strict

const keywords = [
  "type",
  "key",
  "if",
  "elseif", // @TODO: choice between elseif / else if
  "else", // @TODO: default
  "switch", // @TODO: alternative name (choice, choose, case)
  "try",
  "when",
  "for",
  "guard",
  "throw",
  "return"
]

// @TODO: Use Object.fromEntries when available in Node.js
const parsers = {}
keywords.map(s => parsers[s] = str(s))
module.exports = parsers

assert.equal(toValue(parse(parsers.type)("type")), "type")
