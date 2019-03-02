const Object = require("../Object")

class Expression extends Object {

  constructor (type, expressions) {
    super()
    this.type = type
    this.expressions = Array.isArray(expressions) ? expressions : [expressions] // Expression[]
    this.isEvaluated = false
    this.shouldCast = false
    const length = this.expressions.length
    this.isEmpty = length === 0
    this.isSingle = length === 1
    this.isPlural = length > 1
  }

  evaluate () {
    if (this.isEvaluated) return this.value
    const values = this.expressions.map(expression => expression.evaluate())
    this.value = this.isEmpty ? null : this.isSingle ? values[0] : values
    this.isEvaluated = true
    return this.value
  }

  castToType (type) {
    this.castToType = type
    this.shouldCast = true
    return this
  }
}

module.exports = Expression
