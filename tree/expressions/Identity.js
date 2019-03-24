const Expression = require("./Expression")

class Identity extends Expression {

  constructor (str) {
    super()
    const self = str[0] === "."
    const key = str.replace(/^\./, "")
    this.key = key !== "" ? key : null
    this.self = self
    this.isEvaluated = false
  }

  evaluate (env) {

    if (this.isEvaluated) return this.value

    const expressions = env.keys[this.key]
    if (expressions === undefined) throw new Error (this.key + " is not defined in environment")

    this.addExpressions(expressions)

    const values = this.expressions.map(expression => expression.evaluate())
    this.value = this.isEmpty ? null : this.isSingle ? values[0] : values
    this.isEvaluated = true
    return this.value
  }
}

module.exports = Identity
