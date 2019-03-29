const reduceStringsToObject = require("../utils/reduceStringsToObject")
const Type = require("../tree/types/Type")

const types = [
  "Null",
  "Boolean",
  "Number",
  "String"
]

const buildInTypes = reduceStringsToObject(types, type => new Type(type))

module.exports = buildInTypes
