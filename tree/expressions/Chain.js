const Expression = require("./Expression")
const Identity = require("./Identity")

class Chain extends Expression {

  constructor (key, parent) {
    super()
    this.key = key
    this.parent = parent // Expression
    this.isEvaluated = false
  }

  evaluate (scope = {}) {
    if (this.isEvaluated) return this.value

    // @TODO: More abstract identity reference
    const isIdentity = this.parent instanceof Identity
    const expression = isIdentity ? scope[this.parent.key] : this.parent

    const property = expression.properties[this.key]
    if (property === undefined) throw this.key + " is not a property of " + this.parent.constructor.name

    this.value = property()
    this.isEvaluated = true
    return this.value
  }
}

module.exports = Chain
