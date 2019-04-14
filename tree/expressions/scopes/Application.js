const Expression = require("../Expression")
const Statement = require("../statements/Statement")
const Type = require("../../types/Type")
const Function = require("./Function")
const toArray = require("../../../utils/toArray")
const { isFunction } = require("../../../utils/is")

const isStatement = object => object instanceof Statement
const isApplication = object => object instanceof Application
const isType = object => object instanceof Type
const isFunctionExpression = object => object instanceof Function

class Application extends Expression {

  constructor (expression, args) {
    super("Application", expression)
    this.arguments = toArray(args)
  }

  evaluate (env) {

    if (this.isEvaluated) return this.value

    const firstExpression = this.expressions[0]

    let applicative = firstExpression.fetch(env)
    const args = this.arguments[0] && this.arguments[0].isPlural ? this.arguments[0].expressions : this.arguments

    // calling function to get buildins
    // @TODO: buildin statements as Function
    if (isFunction(applicative)) {
      applicative = applicative(args)
    }

    // apply (partial application)
    if (isApplication(applicative)) {
      applicative = applicative.evaluate(env)
    }

    if (isType(applicative)) {
      this.value = applicative.apply(args).evaluate(env)
    }
    else if (isFunctionExpression(applicative)) {
      // set Environment, only for anonymous function declarations
      if (applicative.hasEnvironment() === false) {
        applicative.setEnvironment(env)
      }
      this.value = applicative.apply(args)
    }
    // @TODO: type check statement
    // @TODO: Statement.apply
    else if (isStatement(applicative)) {
      this.value = applicative.apply(args)
    }
    else {
      throw new Error ("Can only apply Type, Function or Statement")
    }

    this.isEvaluated = true
    return this.value
  }
}

module.exports = Application
