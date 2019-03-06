const types = [
  "Null",
  "Boolean",
  "Number",
  "String"
]

const pluralize = str => str + "s"

const plurals = types.map(pluralize)

const all = plurals.concat(types)

/*
const typesAndPlurals = types.map(type => [type, pluralize(type)])
const plurals = typesAndPlurals.map(arr => arr[1])
const typesAndPluralsFlattened = typesAndPlurals.flat()

const isSingle = str => types.includes(str)
const isPlural = str => plurals.includes(str)

const getSingle = plural => typesAndPlurals.find(arr => arr[1] === plural)[0]
*/

module.exports = {
  types,
  plurals,
  all
}
