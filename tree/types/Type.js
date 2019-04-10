const toArray = require("../../utils/toArray")
const isEmpty = arr => arr == null || arr.length === 0
const notEmpty = arr => isEmpty(arr) === false

const Null = require("../expressions/scalars/Null")
const Boolean = require("../expressions/scalars/Boolean")
const Number = require("../expressions/scalars/Number")
const String = require("../expressions/scalars/String")
const Expression = require("../expressions/Expression")

class Type {

  constructor (name, options, types, inputTypes, keys, depth = null, isScalar = false) {

    this.options = toArray(options)
    this.types = toArray(types)
    this.isCompound = this.types.length > 1

    this.inputTypes = toArray(inputTypes)
    this.isFunction = this.inputTypes.length > 0

    this.keys = toArray(keys)
    this.name = name != null ? name : this.createName()
    this.fullName = this.createFullName()

    this.depth = toArray(depth)
    this.isPlural = this.depth.length > 0
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
    if (this.isPlural) {
      return castToPlural(this.name, this.types[0].name, argsArray)
    }
    else if (this.isCompound) {

      if (this.types.length !== args.length)
        throw new Error ("Invalid number of arguments for " + this.name)

      this.types.map((type, index) => {
        const argument = args[index]
        if (argument.type !== type.name)
          throw new Error ("Invalid argument for " + this.name)
      })

      return castToCompound(this.name, argsArray)
    }
    // @TODO: Return rest arguments
    else if (this.isScalar) {
      if (args.length === 0)
        throw new Error ("Invalid number of arguments for Type casting")
      const arg0 = castToScalar(this.name, argsArray[0].evaluate())
      return argsArray.length > 1 ? new Expression(null, [arg0, ...argsArray.slice(1)]) : arg0
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

const castToCompound = (name, values) =>
  new Expression (name, values)

const castToPlural = (name, type, values) =>
  new Expression (name, values.map(value => castToScalar(type, value.evaluate())))


module.exports = Type
