const Expression = require("../Expression")

class Operation extends Expression {

  constructor (fix, operator, ...operands) {
    super()
    this.fix = fix
    this.operator = operator
    this.operands = operands
  }

  evaluate () {

    const BooleanLogic = require("./BooleanLogic")
    const Arithmetic = require("./Arithmetic")
    const StringConcatenation = require("./StringConcatenation")
    
    const operands = this.operands.map(operand => operand.evaluate())
    const type = operands[0].type
    // @TODO: Check if operands types match
    // @TODO: Check if operator is available for specific type
    switch (type) {
    case "Boolean":
      return (new BooleanLogic(this.operator, ...operands)).evaluate()
    case "Number":
      return (new Arithmetic(this.operator, ...operands)).evaluate()
    case "String":
      return (new StringConcatenation(this.operator, ...operands)).evaluate()
    }
  }
}

module.exports = Operation
