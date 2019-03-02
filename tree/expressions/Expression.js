const Object = require("../Object")

class Expression extends Object {

  constructor (expression, type) {
    super()
    this.expression = expression // String | Expression
    this.type = type
    this.isEvaluated = false
  }

  evaluate () {
    if (this.isEvaluated) return this.value
    this.value = evaluate(this.expression, this.type)
    this.isEvaluated = true
    return this.value
  }

  castTo (type) {
    return new Expression(this.expression, type)
  }
}

module.exports = Expression

function evaluate (expression, type = null) {
  if (expression instanceof Expression) {
    return evaluate(expression.expression, type)
  }
}
