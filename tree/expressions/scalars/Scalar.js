const Expression = require("../Expression")

class Scalar extends Expression {

  constructor (type, properties, value, literal) {
    super(type, null, properties)
    this.value = value != null ? value : this.parse(literal)
    this.literal = literal
    this.isEvaluated = true
  }

  typeCheck () {
    return this.type
  }

  evaluate (env) {
    if (this.shouldCast) {
      const type = env.get(this.castToType)
      if (type === undefined || type.isType === false) throw new Error (this.castToType + " is not an existing type")
      return this.castTo(type.value, type.isPluralType).value
    }
    return this.value
  }

  castTo (type, pluralize = false) {

    const name = type.name

    // @TODO: Fix circulair references / extending
    const Null = require("./Null")
    const Boolean = require("./Boolean")
    const Number = require("./Number")
    const String = require("./String")

    const literal = "" + this.value // cast to string
    let scalar
    switch (name) {
    case "Null":
      scalar = new Null (null, literal)
      break
    case "Boolean":
      scalar = new Boolean (null, literal)
      break
    case "Number":
      scalar = new Number (null, literal)
      break
    case "String":
      scalar = new String (null, literal)
      break
    default:
      throw new Error (name + " is not a scalar type")
    }
    return pluralize ? [scalar] : scalar
  }
}

module.exports = Scalar
