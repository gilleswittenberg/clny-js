const Expression = require("../Expression")

class Scalar extends Expression {

  constructor (type, value, literal) {
    super()
    this.type = type
    this.value = literal == null ? value : this.parse(literal)
    this.literal = literal
    this.isEvaluated = true
  }

  evaluate (env) {
    if (this.shouldCast) return this.castTo(this.castToType, env.types).value
    return this.value
  }

  castTo (type, types) {

    const name = type.name
    const exists = types[name] != null
    if (exists === false)
      throw new Error (name + " is not an existing type")

    // @TODO: Fix circulair references / extending
    const Null = require("./Null")
    const Boolean = require("./Boolean")
    const Number = require("./Number")
    const String = require("./String")

    // @TODO: Cast plural to array
    const literal = "" + this.value // cast to string
    switch (name) {
    case "Null":
      return new Null(null, literal)
    case "Boolean":
      return new Boolean(null, literal)
    case "Number":
      return new Number(null, literal)
    case "String":
      return new String(null, literal)
    }
  }
}

module.exports = Scalar
