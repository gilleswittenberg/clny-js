const Expression = require("../Expression")
const TypeError = require("../../errors/TypeError")

class Operation extends Expression {

  constructor (fix, operator, ...operands) {
    super("Operation", operands)
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
      throw new TypeError (null, "Invalid operands for Operation")

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

    let operation
    const t = typeof operands[0]
    const type =
      t === "boolean" ? "Boolean" :
        t === "string" ? "String" :
          t === "number" ? "Number" :
            (() => { throw new TypeError ("Invalid operand type") })()

    switch (type) {
    case "Boolean":
      operation = new BooleanLogic(this.operator, ...operands)
      break
    case "Number":
      if (this.operator === ",,") {
        operation = new Range(...operands)
      } else {
        operation = new Arithmetic(this.operator, ...operands)
      }
      break
    case "String":
      operation = new StringConcatenation(...operands)
      break
    }
    const value = operation.evaluate()
    this.value = value
    this.isEvaluated = true
    return this.value
  }

  printTree () {
    const tree = super.printTree()
    tree.splice(1, 0, this.operator)
    return tree
  }
}

module.exports = Operation
