const Expression = require("./Expression")
const Value = require("./Value")

class Arithmetic extends Expression {

  constructor (operator, ...expressions) {
    super()
    this.operator = operator
    // @TODO: Throw when expressions.length = 0
    this.expressions = expressions
    this.type = "Number"
    this.isEvaluated = false
  }

  evaluate () {
    this.expressions.forEach(expression => expression.evaluate())
    const operator = this.operator
    const left = this.expressions[0].value.value
    const right = this.expressions.length > 1 ? this.expressions[1].value.value : null
    const result = operator != null ? applyArithmetic(operator, left, right) : left
    this.value = new Value(result, this.type)
    this.isEvaluated = true
    return this.value
  }
}

module.exports = Arithmetic

const applyArithmetic = (operator, left, right) => {
  switch (operator) {
  case "+":
    // positive
    if (right == null) return left
    // addition
    return left + right
  case "-":
    // negation
    if (right == null) return -left
    // subtraction
    return left - right
  case "*":
    return left * right
  case "/":
    return left / right
  case "**":
    return Math.pow(left, right)
  }
  // @TODO: Default case
}
