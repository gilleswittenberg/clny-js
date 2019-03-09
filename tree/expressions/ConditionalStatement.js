const Statement = require("./Statement")

class ConditionalStatement extends Statement {

  evaluate (scope = {}) {

    if (this.isEvaluated) return this.value

    if (this.expressions.length != 2) throw "if statement should have 2 arguments"

    const condition = this.expressions[0]
    condition.evaluate(scope)
    const consequent = this.expressions[1]
    if (condition.type !== "Boolean") throw "if statement's first argument should be a Boolean"
    if (consequent.type !== "Scope") throw "if statement's second argument should be a Scope"

    this.value = condition.value === true ? [true, consequent.evaluate()] : [false, null]
    this.isEvaluated = true
    return this.value
  }
}

module.exports = ConditionalStatement
