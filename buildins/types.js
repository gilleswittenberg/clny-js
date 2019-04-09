const reduceStringsToObject = require("../utils/reduceStringsToObject")
const Type = require("../tree/types/Type")

const pluralize = str => str + "s"

const types = [
  "Null",
  "Boolean",
  "Number",
  "String"
]

const buildInTypes = reduceStringsToObject(types, type => new Type(type, null, null, null, null, null, true))
//const buildInPlurals = reduceStringsToObject(types, type => new Type(pluralize(type), null, buildInTypes[type], null, null, Infinity))

//module.exports = { ...buildInTypes, ...buildInPlurals }
module.exports = { ...buildInTypes }
