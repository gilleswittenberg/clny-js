const reduceStringsToObject = require("../utils/reduceStringsToObject")

const {
  str
} = require("arcsecond")

const keywords = [
  "type",
  "key"
]

const parsers = reduceStringsToObject(keywords, keyword => str(keyword))
module.exports = parsers
