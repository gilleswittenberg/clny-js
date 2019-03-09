const Statement = require("./Statement")

class ForStatement extends Statement {

  evaluate (scope = {}) {

    if (this.isEvaluated) return this.value

    if (this.expressions.length !== 2) throw "for statement should have 2 arguments"

    const loop = this.expressions[1]
    if (loop.type !== "Scope") throw "for statement's second argument should be a Scope"

    const expression = this.expressions[0]
    const value = expression.evaluate()
    const arr =
      expression.type === "Number" ? new Array(value).fill(null) :
        expression.isPlural ? expression.expressions :
          value // Range

    this.value = arr.map(() => loop.evaluate(scope))
    this.isEvaluated = true
    return this.value
  }
}

module.exports = ForStatement
