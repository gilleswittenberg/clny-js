const Expression = require("./Expression")

class Identity extends Expression {

  constructor (key) {
    super()
    this.key = key
    this.isEvaluated = false
  }

  evaluate (scope) {
    const expression = scope[this.key]
    if (expression === undefined) throw this.key + " is not defined in scope"
    expression.evaluate()
    this.type = expression.type
    this.value = expression.value.value
    return this.value
  }
}

module.exports = Identity
