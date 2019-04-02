const Expression = require("../Expression")
const Identity = require("../Identity")
const Statement = require("../statements/Statement")
const Type = require("../../types/Type")
const Function = require("./Function")
const toArray = require("../../../utils/toArray")
const { isFunction } = require("../../../utils/is")

const isStatement = object => object instanceof Statement
const isApplication = object => object instanceof Application
const isType = object => object instanceof Type
const isFunctionExpression = object => object instanceof Function
const isIdentity = object => object instanceof Identity

class Application extends Expression {

  constructor (expression, args) {
    super("Application", expression)
    this.arguments = toArray(args)
  }

  evaluate (env) {

    if (this.isEvaluated) return this.value

    const expression = this.expressions[0]
    let toEvaluate = isIdentity(expression) ? env.get(expression.key).value : expression

    // calling function to get buildin Statements
    if (isFunction(toEvaluate)) {
      toEvaluate = toEvaluate(this.arguments)
    }

    // apply (partial application)
    if (isApplication(toEvaluate)) {
      toEvaluate = toEvaluate.evaluate(env)
    }

    if (isType(toEvaluate)) {
      this.value = this.arguments[0].setCastToType(toEvaluate.name).evaluate(env)
    }
    else if (isFunctionExpression(toEvaluate)) {
      // set Environment, only for anonymous function declarations
      if (toEvaluate.hasEnvironment() === false) {
        toEvaluate.setEnvironment(env)
      }
      this.value = toEvaluate.apply(this.arguments)
    }
    else if (isStatement(toEvaluate)) {
      this.value = toEvaluate
    }
    else {
      throw new Error ("Can only apply Type, Function or Statement")
    }

    this.isEvaluated = true
    return this.value
  }
}

module.exports = Application
