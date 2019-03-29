const Expression = require("../Expression")
const Identity = require("../Identity")
const Statement = require("../statements/Statement")
const Type = require("../../types/Type")
const toArray = require("../../../utils/toArray")
const { isFunction } = require("../../../utils/is")

const isStatement = object => object instanceof Statement
const isApplication = object => object instanceof Application
const isType = object => object instanceof Type

class Application extends Expression {

  constructor (expression, args) {
    super("Application", expression)
    this.arguments = toArray(args)
  }

  evaluate (env) {

    // @TODO: Remove circulair reference
    const FunctionScope = require("./FunctionScope")
    const isFunctionScope = object => object instanceof FunctionScope

    if (this.isEvaluated) return this.value

    const expression = this.expressions[0]

    const isIdentity = expression instanceof Identity
    let toEvaluate = isIdentity ? env.get(expression.key).value : expression

    // calling function to get buildin Statements
    if (isFunction(toEvaluate)) {
      toEvaluate = toEvaluate(this.arguments)
    }

    if (isApplication(toEvaluate)) {
      toEvaluate = toEvaluate.evaluate(env)
    }

    if (isType(toEvaluate)) {
      this.value = this.arguments[0].setCastToType(toEvaluate).evaluate(env)
    }
    else if (isFunctionScope(toEvaluate)) {
      this.value = toEvaluate.evaluate(env)
    }
    else if (isStatement(toEvaluate)) {
      this.value = toEvaluate
    }
    else {
      throw new Error ("Can only apply Type, FunctionScope or Statement")
    }

    this.isEvaluated = true
    return this.value
  }
}

module.exports = Application
