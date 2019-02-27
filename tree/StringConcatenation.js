const Expression = require("./Expression")
const Value = require("./Value")

class StringConcatenation extends Expression {

  constructor (...expressions) {
    super()
    // @TODO: Check expressions.length >= 1
    this.expressions = expressions
    this.type = "String"
    this.isEvaluated = false
  }

  evaluate () {
    this.expressions.forEach(expression => expression.evaluate())
    const strings = this.expressions.map(expression => expression.value.value)
    this.value = new Value(concatStrings(...strings), "String")
    this.isEvaluated = true
    return this.value
  }
}

module.exports = StringConcatenation

const concatStrings = (...str) => str.reduce((acc, cur) => acc + cur, "")
