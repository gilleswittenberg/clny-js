const Operation = require("./Operation")

class StringConcatenation extends Operation {

  constructor (...operands) {
    super("INFIX", "+", ...operands)
    this.type = "String"
  }

  typeCheck () {
    return this.type
  }

  evaluate () {
    const left = this.operands[0]
    const right = this.operands[1]
    this.value = concatStrings(left, right)
    this.isEvaluated = true
    return this.value
  }
}

module.exports = StringConcatenation

const concatStrings = (...str) => str.reduce((acc, cur) => acc + cur, "")
