const toArray = require("../../utils/toArray")
const isEmpty = arr => arr == null || arr.length === 0
const notEmpty = arr => isEmpty(arr) === false
const pluralize = str => str + "s"

const Null = require("../expressions/scalars/Null")
const Boolean = require("../expressions/scalars/Boolean")
const Number = require("../expressions/scalars/Number")
const String = require("../expressions/scalars/String")
const Expression = require("../expressions/Expression")

class Type {

  constructor (name, options, types, inputTypes, keys, isScalar = false) {

    this.options = toArray(options)
    this.types = toArray(types)
    this.isCompound = this.types.length > 1

    this.inputTypes = toArray(inputTypes)
    this.isFunction = this.inputTypes.length > 0

    this.keys = toArray(keys)
    this.name = name != null ? name : this.createName()
    this.pluralName = name != null ? pluralize(name) : null
    this.fullName = this.createFullName()

    this.isScalar = isScalar
  }

  createFullName () {
    return this.keys.map(key => key + ": ").join("") + this.name
  }

  createName () {
    // Sum type
    if (notEmpty(this.options)) return this.options.map(option => option.name).join(" | ")
    // Product type
    if (isEmpty(this.inputTypes)) return this.types.map(type => type.fullName).join(", ")
    // Function type
    return this.inputTypes.map(type => type.fullName).join(", ") + " -> " + this.types.map(type => type.name).join(", ")
  }

  fetch () {
    return this
  }

  apply (args) {
    const argsArray = toArray(args)
    if (this.isCompound) {
      return castToCompound(this.name, argsArray)
    }
    else if (this.isScalar) {
      return castToScalar(this.name, argsArray[0].evaluate())
    }
  }
}

const castToScalar = (name, value) => {
  const str = value + ""
  let ret
  switch (name) {
  case "Null":
    ret = new Null (null, str)
    break
  case "Boolean":
    ret = new Boolean (null, str)
    break
  case "Number":
    ret = new Number (null, str)
    break
  case "String":
    ret = new String (null, str)
    break
  }
  return ret
}

const castToCompound = (name, values) => {
  return new Expression (name, values)
}

module.exports = Type
