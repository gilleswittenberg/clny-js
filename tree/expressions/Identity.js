const Expression = require("./Expression")
const EvaluationError = require("../errors/EvaluationError")

const throwEvaluationError = (lineNumber, key) => {
  throw new EvaluationError (null, key + " is not defined in environment")
}

class Identity extends Expression {

  constructor (str) {
    super()
    const self = str[0] === "."
    const key = str.replace(/^\./, "")
    this.key = key !== "" ? key : null
    this.self = self
    this.isEvaluated = false
  }

  fetch (env) {

    // @TODO: Move Error to Environment
    if (env.has(this.key) === false)
      throwEvaluationError(null, this.key)

    return env.get(this.key).value
  }

  evaluate (env) {

    if (this.isEvaluated) return this.value

    // @TODO: Move Error to Environment
    if (env.has(this.key) === false)
      throwEvaluationError(null, this.key)

    const expressions = env.get(this.key).value

    this.addExpressions(expressions)

    const values = this.expressions.map(expression => expression.evaluate())
    this.value = this.isEmpty ? null : this.isSingle ? values[0] : values
    this.isEvaluated = true
    return this.value
  }
}

module.exports = Identity
