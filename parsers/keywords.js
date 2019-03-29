const {
  str
} = require("arcsecond")

const keywords = [
  "type",
  "key"
]

// @TODO: Use Object.fromEntries when available in Node.js
const parsers = keywords.reduce((acc, keyword) => { acc[keyword] = str(keyword); return acc }, {})
module.exports = parsers
