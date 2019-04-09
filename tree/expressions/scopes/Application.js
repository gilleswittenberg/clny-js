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

  typeCheck (expression) {

    if (isType(expression)) {
      if (expression.types.length > 0) {
        if (expression.types.length !== this.arguments.length)
          throw new Error ("Invalid number of arguments for Type / Compound casting")
      } else {
        if (this.arguments.length !== 1)
          throw new Error ("Invalid number of arguments for Type casting")
      }
    } else if (isFunctionExpression(expression)) {
      const inputTypes = expression.type && expression.type.inputTypes || []
      if (inputTypes.length > 0 && inputTypes.length !== this.arguments.length)
        throw new Error ("Invalid number of arguments for function application")
      inputTypes.map((inputType, index) => {
        const argument = this.arguments[index]
        if (argument === undefined)
          throw new Error ("Invalid number of arguments for function application")
        if (argument.type !== inputType)
          throw new Error ("Invalid argument for function application")
      })
    }

    // @TODO: Type check return type
    return this.type
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

    // @TODO: Move to Function.apply / Type.apply
    this.typeCheck(applicative)

    // @TODO: Casting to Plural, Compound
    if (isType(applicative)) {

      if (applicative.isCompound === false) {
        this.value = this.arguments[0].setCastToType(applicative.name).evaluate(env)
      }
    }
    else if (isFunctionExpression(applicative)) {
      // set Environment, only for anonymous function declarations
      if (applicative.hasEnvironment() === false) {
        applicative.setEnvironment(env)
      }
      this.value = applicative.apply(this.arguments)
    }
    // @TODO: type check statement
    else if (isStatement(applicative)) {
      this.value = applicative
    }
    else {
      throw new Error ("Can only apply Type, Function or Statement")
    }

    this.isEvaluated = true
    return this.value
  }
}

module.exports = Application
