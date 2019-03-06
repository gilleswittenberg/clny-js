const Expression = require("./Expression")

class Identity extends Expression {

  constructor (key) {
    super()
    this.key = key
    this.isEvaluated = false
  }

  evaluate (scope = {}) {
    if (this.isEvaluated) return this.value

    const expressions = scope[this.key]
    if (expressions === undefined) throw this.key + " is not defined in scope"

    this.addExpressions(expressions)

    const values = this.expressions.map(expression => expression.evaluate())
    this.value = this.isEmpty ? null : this.isSingle ? values[0] : values
    this.isEvaluated = true
    return this.value
  }
}

module.exports = Identity
