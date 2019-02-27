const Expression = require("./Expression")
const Value = require("./Value")

class BooleanLogic extends Expression {

  constructor (operator, ...expressions) {
    super()
    this.operator = operator
    // @TODO: Check expressions.length >= 1
    this.expressions = expressions
    this.type = "Boolean"
    this.isEvaluated = false
  }

  evaluate () {
    this.expressions.forEach(expression => expression.evaluate())
    const booleans = this.expressions.map(expression => expression.value.value)
    this.value = new Value(applyLogic(this.operator, ...booleans), this.type)
    this.isEvaluated = true
    return this.value
  }
}

module.exports = BooleanLogic

const applyLogic = (operator, left, right) => {
  switch (operator) {
  case "!":
    return !left
  case "&":
    return left && right
  case "|":
    return left || right
  }
  // @TODO: Default case
}
