const {
  str
} = require("arcsecond")

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
keywords.forEach(keyword => parsers[keyword] = str(keyword))
module.exports = parsers
