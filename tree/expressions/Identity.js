const Expression = require("./Expression")

class Identity extends Expression {

  constructor (key) {
    super()
    this.key = key
    this.isEvaluated = false
  }

  evaluate (scope) {
    this.expressions = scope[this.key]
    if (this.expressions === undefined) throw this.key + " is not defined in scope"
    return super.evaluate()
  }
}

module.exports = Identity
