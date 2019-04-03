const Expression = require("../Expression")

class Operation extends Expression {

  constructor (fix, operator, ...operands) {
    super("Operation")
    this.fix = fix
    this.operator = operator
    this.operands = operands
  }

  typeCheck () {

    const operands = this.operands.map(operand => operand.typeCheck())
    const firstOperand = operands[0]
    const operatorsMap = {
      "Boolean": ["&", "|", "!"],
      "Number": ["+", "-", "*", "/", "**", ",,"],
      "String": ["+"]
    }
    const operators = operatorsMap[firstOperand]

    // @TODO: Check number of operands (1 or 2 depending on operator)
    const equals = s => t => s === t
    if (!operators.includes(this.operator) || !operands.every(equals(firstOperand)))
      throw new Error ("Invalid operands for Operation")

    return firstOperand
  }

  evaluate (env) {

    // @TODO: Remove circulair references
    const BooleanLogic = require("./BooleanLogic")
    const Arithmetic = require("./Arithmetic")
    const StringConcatenation = require("./StringConcatenation")
    const Range = require("./Range")

    this.typeCheck()

    const operands = this.operands.map(operand => operand.evaluate(env))

    // @TODO: Check if operands types match
    // @TODO: Check if operator is available for specific type
    const t = typeof operands[0]
    const type =
      t === "boolean" ? "Boolean" :
        t === "string" ? "String" :
          t === "number" ? "Number" :
            (() => { throw new Error ("Invalid operand type") })()

    switch (type) {
    case "Boolean":
      return (new BooleanLogic(this.operator, ...operands)).evaluate()
    case "Number":
      if (this.operator === ",,") return (new Range(...operands)).evaluate()
      return (new Arithmetic(this.operator, ...operands)).evaluate()
    case "String":
      return (new StringConcatenation(...operands)).evaluate()
    }
  }
}

module.exports = Operation
