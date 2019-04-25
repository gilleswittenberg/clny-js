const Expression = require("./Expression")
const EvaluationError = require("../errors/EvaluationError")

const throwEvaluationError = (lineNumber, key) => {
  throw new EvaluationError (null, key + " is not defined in environment")
}

class Identity extends Expression {

  constructor (key, isSelf = false) {
    super("Identity")
    this.key = key
    this.self = isSelf
    this.isEvaluated = false
  }

  fetch (env) {

    // @TODO: Self .
    // @TODO: Key for Type

    // @TODO: Move Error to Environment
    if (env.has(this.key.name) === false)
      throwEvaluationError(null, this.key.name)

    return env.get(this.key.name).value
  }

  evaluate (env) {

    if (this.isEvaluated) return this.value

    // @TODO: Self .

    // @TODO: Move Error to Environment
    if (env.has(this.key.name) === false)
      throwEvaluationError(null, this.key.name)

    const expressions = env.get(this.key.name).value

    this.addExpressions(expressions)

    const values = this.expressions.map(expression => expression.evaluate())
    this.value = this.isEmpty ? null : this.isSingle ? values[0] : values
    this.isEvaluated = true
    return this.value
  }
}

module.exports = Identity
