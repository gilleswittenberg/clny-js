const Object = require("./Object")
const toArray = require("../utils/toArray")

// @TODO: Extend Expression
class Statement extends Object {

  constructor (name, expressions) {
    super()
    this.name = name
    this.expressions = toArray(expressions)
    this.isEvaluated = false
  }

  evaluate () {
    if (this.isEvaluated) return this.value
    const values = this.expressions.map(expression => expression.evaluate())
    const value = values.length > 1 ? values : values[0]
    this.value = value
    this.isEvaluated = true
    return this.value
  }
}

module.exports = Statement
