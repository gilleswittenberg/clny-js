const Object = require("./Object")

module.exports = class Statement extends Object {

  constructor (name, expressions) {
    super()
    this.name = name
    // @TODO: pluralize single expression
    this.expressions = expressions
    this.isEvaluated = false
  }

  evaluate () {
    if (this.isEvaluated) return this.expressions
    this.expressions.forEach(expression => expression.evaluate())
    this.isEvaluated = true
    return this.expressions
  }
}
