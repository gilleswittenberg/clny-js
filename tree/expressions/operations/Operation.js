const Expression = require("../Expression")

class Operation extends Expression {

  constructor (fix, operator, ...operands) {
    super()
    this.expressions = null
    this.fix = fix
    this.operator = operator
    this.operands = operands
  }

  evaluate () {

    const BooleanLogic = require("./BooleanLogic")
    const Arithmetic = require("./Arithmetic")
    const StringConcatenation = require("./StringConcatenation")
    const Range = require("./Range")

    const operands = this.operands.map(operand => operand.evaluate())

    // @TODO: Check if operands types match
    // @TODO: Check if operator is available for specific type
    const t = typeof operands[0]
    const type =
      t === "boolean" ? "Boolean" :
        t === "string" ? "String" :
          t === "number" ? "Number" :
            (() => { throw "Invalid operand type" })()

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
