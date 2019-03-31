const Expression = require("./Expression")
const Identity = require("./Identity")

class Property extends Expression {

  constructor (key, parent) {
    super()
    this.key = key
    this.parent = parent // Expression
    this.isEvaluated = false
  }

  evaluate (env) {
    if (this.isEvaluated) return this.value

    // @TODO: More abstract identity reference
    const isIdentity = this.parent instanceof Identity
    const expression = isIdentity ? env.get(this.parent.key).value : this.parent

    if (expression.hasProperty(this.key) === false) throw new Error (this.key + " is not a property of " + this.parent.constructor.name)
    const property = expression.getProperty(this.key, env)

    this.value = typeof property === "function" ? property() : property
    this.isEvaluated = true
    return this.value
  }
}

module.exports = Property
