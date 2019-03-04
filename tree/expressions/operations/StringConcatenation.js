const Operation = require("./Operation")
const String = require("../scalars/String")

class StringConcatenation extends Operation {

  constructor (...operands) {
    super("INFIX", "+", ...operands)
    this.type = "String"
  }

  evaluate () {
    this.operands.forEach(operand => operand.evaluate())
    const left = this.operands[0].value
    const right = this.operands[1].value
    this.value = new String(concatStrings(left, right)).value
    this.isEvaluated = true
    return this.value
  }
}

module.exports = StringConcatenation

const concatStrings = (...str) => str.reduce((acc, cur) => acc + cur, "")
