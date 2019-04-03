const Operation = require("./Operation")

class BooleanLogic extends Operation {

  constructor (operator, ...operands) {
    const fix = operands.length > 1 ? "INFIX" : "PREFIX"
    super(fix, operator, ...operands)
    this.type = "Boolean"
  }

  typeCheck () {
    return this.type
  }

  evaluate () {
    const operator = this.operator
    const left = this.operands[0]
    const right = this.operands.length > 1 ? this.operands[1] : null
    const result = operator != null ? applyLogic(operator, left, right) : left
    this.value = result
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
