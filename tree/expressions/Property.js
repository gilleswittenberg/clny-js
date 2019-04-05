const Expression = require("./Expression")

class Property extends Expression {

  constructor (key, parent) {
    super()
    this.key = key
    this.parent = parent // Expression
    this.isEvaluated = false
  }

  evaluate (env) {

    if (this.isEvaluated) return this.value

    const expression = this.parent.fetch(env)

    // @TODO: Move Error to getProperty
    if (expression.hasProperty(this.key) === false) throw new Error (this.key + " is not a property of " + this.parent.constructor.name)
    const property = expression.getProperty(this.key, env)

    // @TODO: Move calling function to getProperty
    this.value = typeof property === "function" ? property() : property
    this.isEvaluated = true
    return this.value
  }
}

module.exports = Property
