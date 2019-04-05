const Expression = require("../Expression")
const Identity = require("../Identity")
const Statement = require("../statements/Statement")
const Type = require("../../types/Type")
const Function = require("./Function")
const toArray = require("../../../utils/toArray")

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

    const expression = this.expressions[0]
    let toEvaluate = isIdentity(expression) ? env.get(expression.key).value : expression

    // calling function to get buildins
    if (toEvaluate.name === "buildInStatement") {
      toEvaluate = toEvaluate(this.arguments)
    }

    // apply (partial application)
    if (isApplication(toEvaluate)) {
      toEvaluate = toEvaluate.evaluate(env)
    }

    this.typeCheck(toEvaluate)

    // @TODO: Casting to Plural, Compound
    if (isType(toEvaluate)) {

      if (toEvaluate.isCompound === false) {
        this.value = this.arguments[0].setCastToType(toEvaluate.name).evaluate(env)
      }
    }
    else if (isFunctionExpression(toEvaluate)) {
      // set Environment, only for anonymous function declarations
      if (toEvaluate.hasEnvironment() === false) {
        toEvaluate.setEnvironment(env)
      }
      this.value = toEvaluate.apply(this.arguments)
    }
    // @TODO: type check statement
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
