const Statement = require("./Statement")
const TypeError = require("../../errors/TypeError")

const isRange = expression => expression.type === "Operation" && expression.operator === ",,"

class ForStatement extends Statement {

  evaluate (env) {

    if (this.isEvaluated) return this.value

    if (this.expressions.length !== 2) throw new TypeError (null, "for statement should have 2 arguments")

    const expression = this.expressions[0]
    const value = expression.evaluate(env)
    const arr =
      expression.type === "Number" ? new Array(value).fill(null) :
        isRange(expression) ? value :
          expression.isPlural ? expression.expressions :
            () => { throw new TypeError (null, "for statement's first argument should be a Number / Plural / Range") }

    const scope = this.expressions[1]
    if (scope.type !== "Scope") throw new TypeError (null, "for statement's second argument should be a Scope")

    this.value = arr.map(() => scope.evaluate(env))
    this.isEvaluated = true
    return this.value
  }
}

module.exports = ForStatement
