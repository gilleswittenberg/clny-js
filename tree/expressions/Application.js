const Expression = require("./Expression")
const Identity = require("./Identity")
const Statement = require("./Statement")
const toArray = require("../../utils/toArray")
const { isFunction } = require("../../utils/is")

const isStatement = object => object instanceof Statement
const isApplication = object => object instanceof Application

class Application extends Expression {

  constructor (expression, args) {
    super("Application", expression)
    this.arguments = toArray(args)
  }

  evaluate (env) {

    const FunctionScope = require("./FunctionScope")
    const isFunctionScope = object => object instanceof FunctionScope

    if (this.isEvaluated) return this.value

    const expression = this.expressions[0]

    const isIdentity = expression instanceof Identity
    let toEvaluate = isIdentity ? env.keys[expression.key] : expression

    if (isFunction(toEvaluate)) {
      toEvaluate = toEvaluate(this.arguments)
    }
    if (isApplication(toEvaluate)) {
      toEvaluate = toEvaluate.evaluate(env)
    }

    if (isFunctionScope(toEvaluate)) {
      this.value = toEvaluate.evaluate(env)
      this.isEvaluated = true
      return this.value
    }
    else if (isStatement(toEvaluate)) {
      this.value = toEvaluate
      this.isEvaluated = true
      return toEvaluate
    }
    else {
      throw new Error ("Can only apply FunctionScope or Statement")
    }
  }
}

module.exports = Application
