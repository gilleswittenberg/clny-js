const Type = require("../tree/Type")

const types = [
  "Null",
  "Boolean",
  "Number",
  "String"
]

const buildInTypes = types.reduce((acc, type) => {
  acc[type] = new Type(type)
  return acc
}, {})

module.exports = buildInTypes
