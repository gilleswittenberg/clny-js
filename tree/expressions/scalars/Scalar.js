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
    return this.value
  }
}

module.exports = Scalar
