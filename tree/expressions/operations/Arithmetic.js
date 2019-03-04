const Operation = require("./Operation")

class Arithmetic extends Operation {

  constructor (operator, ...operands) {
    const fix = operands.length > 1 ? "INFIX" : "PREFIX"
    super(fix, operator, ...operands)
    this.type = "Number"
  }

  evaluate () {
    const operator = this.operator
    const left = this.operands[0]
    const right = this.operands.length > 1 ? this.operands[1] : null
    const result = operator != null ? applyArithmetic(operator, left, right) : left
    this.value = result
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
