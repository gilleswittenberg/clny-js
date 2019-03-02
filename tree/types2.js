const types = [
  "Null",
  "Boolean",
  "Number",
  "String"
]

const pluralize = str => str + "s"

const pluralTypes = types.map(pluralize)

module.exports = {
  types,
  pluralTypes
}
