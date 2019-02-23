const Object = require("./Object")

module.exports = class Statement extends Object {

  constructor (name, expressions) {
    super()
    this.name = name
    this.expressions = expressions
    this.isEvaluated = false
  }

  evaluate () {
    if (this.isEvaluated) return this.values()
    this.expressions.forEach(expression => expression.evaluate())
    this.isEvaluated = true
    return this.values()
  }

  values () {
    return this.expressions.map(expression => expression.value.value)
  }
}
