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

  evaluate () {
    return this.value
  }

  printTree () {
    return [this.type, this.value]
  }
}

module.exports = Scalar
