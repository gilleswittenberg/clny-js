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

    // @TODO: Cast plural to array
    const literal = "" + this.value // cast to string
    switch (type) {
    case "Null":
    case "Nulls":
      return new Null(null, literal)
    case "Boolean":
    case "Booleans":
      return new Boolean(null, literal)
    case "Number":
    case "Numbers":
      return new Number(null, literal)
    case "String":
    case "Strings":
      return new String(null, literal)
    }
  }
}

module.exports = Scalar
