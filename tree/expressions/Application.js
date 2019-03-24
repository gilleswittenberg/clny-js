const Expression = require("./Expression")
const FunctionScope = require("./FunctionScope")
const Identity = require("./Identity")

class Application extends Expression {

  constructor (expression, args) {
    super("Application", expression)
    this.arguments = args
  }

  evaluate (env) {
    if (this.isEvaluated) return this.value
    const expression = this.expressions[0]

    // @TODO: More abstract identity reference
    const isIdentity = expression instanceof Identity
    let toEvaluate = isIdentity ? env.keys[expression.key] : expression

    if (toEvaluate instanceof Application) {
      toEvaluate = toEvaluate.evaluate(env)
    }

    // @TODO: More abstract type checking
    if (!(toEvaluate instanceof FunctionScope)) throw new Error ("Can not apply non FunctionScope Expression")
    this.value = toEvaluate.evaluate(env)
    this.isEvaluated = true
    return this.value
  }
}

module.exports = Application
