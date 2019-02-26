const Expression = require("./Expression")
const Value = require("./Value")

class Arithmetic extends Expression {

  constructor (expression, expression1, operator) {
    super()
    this.expressions = [expression, expression1].filter(expr => expr != null)
    this.operator = operator
    this.type = "Number"
    this.isEvaluated = false
  }

  evaluate () {
    this.expressions.forEach(expression => expression.evaluate())
    const left = this.expressions.length > 1 ? this.expressions[0].value.value : null
    const right = this.expressions.length > 1 ? this.expressions[1].value.value : this.expressions[0].value.value
    const result = applyArithmetic(left, right, this.operator)
    this.value = new Value(result, "Number")
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
    // negate or subtraction
    return (left != null ? left : 0) - right
  case "*":
    return left * right
  case "/":
    return left / right
  case "**":
    return Math.pow(left, right)
  }
  // @TODO: Default case
}
