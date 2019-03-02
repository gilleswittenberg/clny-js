const Expression = require("../Expression")

class Scalar extends Expression {

  constructor (type, value, literal) {
    super()
    this.type = type
    this.value = literal == null ? value : this.parse(literal)
    this.literal = literal
    this.isEvaluated = true
  }

  evaluate () {
    if (this.shouldCast) return this.castTo(this.castToType).value
    return this.value
  }

  castTo (type) {

    const Null = require("./Null")
    const Boolean = require("./Boolean")
    const Number = require("./Number")
    const String = require("./String")

    const literal = "" + this.value // cast to string
    switch (type) {
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
