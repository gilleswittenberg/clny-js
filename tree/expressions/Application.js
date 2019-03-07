const Expression = require("./Expression")
const Scope = require("./Scope")
const Identity = require("./Identity")

class Application extends Expression {

  constructor (expression, args) {
    super("Application", expression)
    this.arguments = args
  }

  evaluate (scope = {}) {
    if (this.isEvaluated) return this.value
    const expression = this.expressions[0]
    const isIdentity = expression instanceof Identity
    const toEvaluate = isIdentity ? scope[expression.key] : expression
    // @TODO: More abstract type checking
    if (!(toEvaluate instanceof Scope)) throw "Can not apply non Scope Expression"
    this.value = toEvaluate.evaluate()
    this.isEvaluated = true
    return this.value
  }
}

module.exports = Application
