const Expression = require("../Expression")

const isFunctionExpression = object => object instanceof Function

const properties = {
  apply: expression => args => expression.apply(args),
  parameters: expression => expression.type != null ? expression.type.inputTypes.map(type => type.fullName).join(", ") : "",
  arity: expression => expression.type != null ? expression.type.inputTypes.length : 0,
  returnType: expression => expression.type != null ? expression.type.types.map(type => type.fullName).join(", ") : "Any"
}

class Function extends Expression {

  constructor (type, scope, environment) {
    super(type, scope, properties)
    this.environment = environment // lexical scope
    this.isEvaluated = false
  }

  hasEnvironment () {
    return this.environment != null
  }

  setEnvironment (environment) {
    this.environment = environment
    return this
  }

  evaluate (env) {
    if (this.isEvaluated) return this.value
    this.setEnvironment(env)
    this.isEvaluated = true
    this.value = super.evaluate(env)
    return this.value
  }

  apply (args) {
    const inputs = this.type != null ? this.type.inputTypes : []
    const argsObject = inputs.reduce((acc, type, index) => {
      acc[type.keys[0]] = args[index]
      return acc
    }, {})
    const environment = this.environment.setArgs(argsObject)
    const expression = this.expressions[0]
    return isFunctionExpression(expression) ? expression : expression.evaluate(environment, args)
  }
}

module.exports = Function
