const Expression = require("./Expression")

class Property extends Expression {

  constructor (key, expression) {
    super("Property", expression)
    this.key = key
    this.isEvaluated = false
  }

  evaluate (env) {

    if (this.isEvaluated) return this.value

    const expression = this.expressions[0].fetch(env)
    const property = expression.getProperty(this.key.name)

    // @TODO: Move calling function to getProperty
    this.value = typeof property === "function" ? property() : property

    this.isEvaluated = true
    return this.value
  }
}

module.exports = Property
