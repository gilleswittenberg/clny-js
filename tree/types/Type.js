const setVisibilityProperties = require("./setVisibilityProperties")
const toArray = require("../../utils/toArray")
const isEmpty = arr => arr == null || arr.length === 0
const notEmpty = arr => isEmpty(arr) === false

const Null = require("../expressions/scalars/Null")
const Boolean = require("../expressions/scalars/Boolean")
const Number = require("../expressions/scalars/Number")
const String = require("../expressions/scalars/String")
const Expression = require("../expressions/Expression")

const TypeError = require("../errors/TypeError")

class Type {

  constructor (name, options, types, inputTypes, keys, properties = null, depth = null, isScalar = false) {

    this.options = toArray(options)
    this.types = toArray(types)
    this.isCompound = this.types.length > 1

    this.inputTypes = toArray(inputTypes)
    this.isFunction = this.inputTypes.length > 0

    this.keys = toArray(keys)
    this.name = name != null ? name : this.createName()
    this.fullName = this.createFullName()

    this.setProperties(toArray(properties))

    this.depth = toArray(depth)
    this.isPlural = this.depth.length > 0
    this.isScalar = isScalar
  }

  createName () {
    // Sum type
    if (notEmpty(this.options)) return this.options.map(option => option.name).join(" | ")
    // Product type
    if (isEmpty(this.inputTypes)) return this.types.map(type => type.fullName).join(", ")
    // Function type
    return this.inputTypes.map(type => type.fullName).join(", ") + " -> " + this.types.map(type => type.name).join(", ")
  }

  createFullName () {
    return this.keys.map(key => key.name + ": ").join("") + this.name
  }

  setProperties (properties) {
    this.properties = properties.reduce((acc, property) => {
      const key = property.keys[0]
      acc[key.name] = {
        property: property.expressions[0].value,
        visibility: key.visibility
      }
      return acc
    }, {})
  }

  fetch (env) {
    const value = env.get(this.name)
    if (value === undefined || value.isType === false)
      throw new TypeError (null, this.name + " is not a Type")
    return value.value
  }

  apply (args) {
    const argsArray = toArray(args)
    if (this.isPlural) {
      return castToPlural(this.name, this.types[0].name, argsArray)
    }
    else if (this.isCompound) {

      if (this.types.length !== argsArray.length)
        throw new TypeError (null, "Invalid number of arguments for " + this.name)

      this.types.map((type, index) => {
        const argument = argsArray[index]
        if (argument.type !== type.name)
          throw new TypeError (null, "Invalid argument for " + this.name)
      })

      return castToCompound(this.name, this.types, this.properties, argsArray)
    }
    else if (this.isScalar) {
      if (args.length === 0)
        throw new TypeError (null, "Invalid number of arguments for Type casting")
      const arg0 = castToScalar(this.name, argsArray[0].evaluate())
      return argsArray.length > 1 ? new Expression(null, [arg0, ...argsArray.slice(1)]) : arg0
    }
  }
}

// @TODO: Rename to createScalar
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

// @TODO: Rename to createCompound
const castToCompound = (name, types, properties, values) => {
  const filterPropertiesByVisibility = (properties, visibility) => Object.keys(properties).reduce((acc, name) => {
    const property = properties[name]
    if (property.visibility === visibility) acc[name] = property
    return acc
  }, {})
  const privateProperties = { ...setVisibilityProperties({ init: () => expressions => expressions }, "PRIVATE"), ...filterPropertiesByVisibility(properties, "PRIVATE") }
  const convenienceProperties = filterPropertiesByVisibility(properties, "CONVENIENCE")
  const propertiesFromTypes = types.reduce((acc, type, index) => {
    // @TODO: Multiple keys
    const key = type.keys[0]
    acc[key] = ({ value }) => value[index]
    return acc
  }, {})
  const dataProperties = setVisibilityProperties(propertiesFromTypes, "DATA")
  return new Expression (name, values, { ...privateProperties, ...convenienceProperties, ...dataProperties })
}

// @TODO: Rename to createPlural
const castToPlural = (name, type, values) =>
  new Expression (name, values.map(value => castToScalar(type, value.evaluate())))

module.exports = Type
