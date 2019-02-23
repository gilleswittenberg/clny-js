const Expression = require("./Expression")
const Value = require("./Value")

class Arithmetic extends Expression {

  constructor (expression, expression1, operator) {
    super()
    this.expressions = [expression, expression1]
    this.operator = operator
    this.type = "Number"
    this.isEvaluated = false
  }

  evaluate () {
    this.expressions.forEach(expression => expression.evaluate())
    this.value = new Value(applyArithmetic(this.expressions[0].value.value, this.expressions[1].value.value, this.operator), "Number")
    this.isEvaluated = true
    return this.value
  }
}

module.exports = Arithmetic

const applyArithmetic = (left, right, operator) => {
  switch (operator) {
  case "+":
    return left + right
  case "-":
    return left - right
  case "*":
    return left * right
  case "/":
    return left / right
  }
  // @TODO: Default case
}
