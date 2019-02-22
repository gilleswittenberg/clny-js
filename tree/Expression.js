const Value = require("./Value")
const Object = require("./Object")

class Expression extends Object {

  constructor (expression, type) {
    super()
    this.expression = expression // String
    this.type = type
    this.value = null
    this.isEvaluated = false
  }

  evaluate () {
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
  if (expression instanceof Value) {
    return expression
  }
  if (expression instanceof Expression) {
    return evaluate(expression.value, type)
  }
  return new Value(expression, type)
}
