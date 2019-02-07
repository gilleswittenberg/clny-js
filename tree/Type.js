class Type {

  // @TODO: fullName e.g. (key: Name)

  constructor (name, options, types, inputTypes, keys) {

    this.name = name != null ? name :
      notEmpty(options) ? optionsToName(options) :
      notEmpty(types) || notEmpty(inputTypes) ? typesToName(types, inputTypes) :
      null

    this.options =
      isEmpty(options) ? [this] :
      toArray(options).map(nameToType)
    this.types =
      isEmpty(types) ? this.options :
      toArray(types).map(nameToType)
    this.isPlural = this.types.length > 1

    this.inputTypes =
      notEmpty(inputTypes) ? toArray(inputTypes).map(nameToType) :
      []
    this.isFunction = this.inputTypes > 0

    this.keys = toArray(keys)
  }

}

module.exports = Type

const isEmpty = arr => arr == null || arr.length === 0
const notEmpty = arr => isEmpty(arr) === false
const toArray = arr => Array.isArray(arr) ? arr : arr != null ? [arr] : []

const join = (arr, sep) => toArray(arr).join(sep)
const optionsToName = arr => join(arr, " | ")
const typesToName = (types, inputTypes) => {
  const sep = ", "
  const arrow = " -> "
  return (notEmpty(inputTypes) ? join(inputTypes, sep) + arrow : "") + join(types, sep)
}

const nameToType = name => (new Type(name))


// tests

const assert = require("assert").strict

const nullType = new Type("Null")
assert.equal(nullType.name, "Null")
assert.ok(nullType.options[0] instanceof Type)
assert.equal(nullType.options[0].name, "Null")
assert.equal(nullType.types[0].name, "Null")
assert.deepEqual(nullType.inputTypes, [])
assert.deepEqual(nullType.isPlural, false)
assert.deepEqual(nullType.isFunction, false)

const trueType = new Type("True")
assert.equal(trueType.name, "True")
assert.ok(trueType.options[0] instanceof Type)
assert.equal(trueType.options[0].name, "True")
assert.equal(trueType.types[0].name, "True")

const boolType = new Type("Bool", ["False", "True"])
assert.equal(boolType.name, "Bool")
assert.equal(boolType.options.length, 2)
assert.ok(boolType.options[0] instanceof Type)
assert.equal(boolType.options[0].name, "False")
assert.ok(boolType.options[1] instanceof Type)
assert.equal(boolType.options[1].name, "True")
assert.ok(boolType.types[0] instanceof Type)

const tupleType = new Type("Tuple", null, ["String", "Bool"])
assert.equal(tupleType.name, "Tuple")
assert.equal(tupleType.options[0], tupleType)
assert.equal(tupleType.types[0].name, "String")
assert.equal(tupleType.types[1].name, "Bool")
assert.equal(tupleType.isPlural, true)

const sumType = new Type(null, ["String", "Bool"])
assert.equal(sumType.name, "String | Bool")

const productType = new Type(null, null, ["String", "Bool"])
assert.equal(productType.name, "String, Bool")

const namedType = new Type("String", null, null, null, "key")
assert.equal(namedType.name, "String")
assert.deepEqual(namedType.keys, ["key"])

const aliasType = new Type("String", null, null, null, ["key", "alias"])
assert.equal(aliasType.name, "String")
assert.deepEqual(aliasType.keys, ["key", "alias"])

const functionType = new Type(null, null, "Bool", ["String", "Number"])
assert.equal(functionType.inputTypes.length, 2)
assert.equal(functionType.inputTypes[0].name, "String")
assert.equal(functionType.inputTypes[1].name, "Number")
assert.equal(functionType.name, "String, Number -> Bool")
