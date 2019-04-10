const Expression = require("../Expression")
const Statement = require("../statements/Statement")
const Type = require("../../types/Type")
const Function = require("./Function")
const toArray = require("../../../utils/toArray")

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

    // calling function to get buildins
    // @TODO: buildin statements as Function
    if (applicative.name === "buildInStatement") {
      applicative = applicative(this.arguments)
    }

    // apply (partial application)
    if (isApplication(applicative)) {
      applicative = applicative.evaluate(env)
    }

    if (isType(applicative)) {
      this.value = applicative.apply(this.arguments).evaluate(env)
    }
    else if (isFunctionExpression(applicative)) {
      // set Environment, only for anonymous function declarations
      if (applicative.hasEnvironment() === false) {
        applicative.setEnvironment(env)
      }
      this.value = applicative.apply(this.arguments)
    }
    // @TODO: type check statement
    // @TODO: Statement.apply
    else if (isStatement(applicative)) {
      this.value = applicative.apply(this.arguments)
    }
    else {
      throw new Error ("Can only apply Type, Function or Statement")
    }

    this.isEvaluated = true
    return this.value
  }
}

module.exports = Application
