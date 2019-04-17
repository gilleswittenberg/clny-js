const reduceStringsToObject = require("../utils/reduceStringsToObject")
const Type = require("../tree/types/Type")

const pluralize = str => str + "s"

const types = [
  "Null",
  "Boolean",
  "Number",
  "String"
]

const buildInTypes = reduceStringsToObject(types, type => new Type(type, null, null, null, null, null, null, null, true))
const buildInPlurals = types.reduce((acc, name) => {
  const plural = pluralize(name)
  const type = new Type(plural, null, buildInTypes[name], null, null, null, null, Infinity)
  acc[plural] = type
  return acc
}, {})

module.exports = { ...buildInTypes, ...buildInPlurals }
