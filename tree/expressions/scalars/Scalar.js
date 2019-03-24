const Expression = require("../Expression")

class Scalar extends Expression {

  constructor (type, properties, value, literal) {
    super(type, [], properties)
    this.value = literal == null ? value : this.parse(literal)
    this.literal = literal
    this.isEvaluated = true
  }

  evaluate (env) {
    if (this.shouldCast) {
      const typeArray = env.getType(this.castToType)
      if (typeArray == null) throw new Error (this.castToType + " is not an existing type")
      const [type, isPlural] = type
      return this.castTo(type, isPlural)
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

    // @TODO: Cast plural to array
    const literal = "" + this.value // cast to string
    let scalar
    switch (name) {
    case "Null":
      scalar = new Null(null, literal)
      break
    case "Boolean":
      scalar = new Boolean(null, literal)
      break
    case "Number":
      scalar = new Number(null, literal)
      break
    case "String":
      scalar = new String(null, literal)
      break
    default:
      throw new Error(name + " is not a scalar type")
    }
    return pluralize ? [scalar] : scalar
  }
}

module.exports = Scalar
