const Statement = require("./Statement")

class ForStatement extends Statement {

  evaluate (env) {

    if (this.isEvaluated) return this.value

    if (this.expressions.length !== 2) throw new Error ("for statement should have 2 arguments")

    const loop = this.expressions[1]
    if (loop.type !== "Scope") throw new Error ("for statement's second argument should be a Scope")

    const expression = this.expressions[0]
    const value = expression.evaluate(env)
    const arr =
      expression.type === "Number" ? new Array(value).fill(null) :
        expression.isPlural ? expression.expressions :
          value // Range

    this.value = arr.map(() => loop.evaluate(env))
    this.isEvaluated = true
    return this.value
  }
}

module.exports = ForStatement
