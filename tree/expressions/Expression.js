const Object = require("../Object")

class Expression extends Object {

  constructor (type, expressions) {
    
    super()

    this.type = type

    this.expressions = [] // Expression[]
    const expressionsArray = Array.isArray(expressions) ? expressions : [expressions]
    expressionsArray.forEach(expression => this.addExpression(expression))

    this.isEvaluated = false
    this.shouldCast = false
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

  addExpression (expression) {
    this.expressions.push(expression)
    this.setSize()
  }

  setSize () {
    const length = this.expressions.length
    this.isEmpty = length === 0
    this.isSingle = length === 1
    this.isPlural = length > 1
  }
}

module.exports = Expression
