const Value = require("./Value")
const Object = require("./Object")

class Expression extends Object {

  constructor (expression) {
    super()
    this.value = evaluate(expression)
    //this.kinds = ["Impure", "Optional", "Throwable", "Async", "Mutable"]
  }
}

module.exports = Expression

function evaluate (expression) {
  if (expression instanceof Value) {
    return expression
  }
  if (expression instanceof Expression) {
    return evaluate(expression.value)
  }
  return new Value(expression)
}
