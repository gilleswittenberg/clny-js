const Value = require("./Value")
const Object = require("./Object")

class Expression extends Object {

  constructor (expression, type = null) {
    super()
    this.expression = expression
    this.castTo(type)
    //this.kinds = ["Impure", "Optional", "Throwable", "Async", "Mutable"]
  }

  // @TODO: Make immutable
  castTo (type) {
    this.value = evaluate(this.expression, type)
    return this
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
