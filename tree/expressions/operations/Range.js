const Operation = require("./Operation")
const Number = require("../scalars/Number")
const TypeError = require("../../errors/TypeError")

class Range extends Operation {

  constructor (start, end) {
    super("INFIX", ",,", start, end)
    this.type = "Range"
  }

  typeCheck () {
    return this.type
  }

  evaluate (env) {
    if (this.isEvaluated) return this.value

    const start = this.operands[0]
    const end = this.operands[1]
    const range = this.createRange(start, end)

    const expressions = range.map(n => new Number(n))
    this.expressions = []
    this.addExpressions(expressions)

    this.value = this.expressions.map(expression => expression.evaluate(env))
    this.isEvaluated = true
    return this.value
  }


  createRange (start, end) {

    if (start == null || end == null) throw new TypeError (null, "Invalid Range start or end")

    const isAscending = start <= end ? true : false
    const next = n => isAscending ? n + 1 : n - 1
    const hasEnded = n => isAscending ? n >= end : n <= end
    const range = []
    let i = start
    while (hasEnded(i) === false) {
      range.push(i)
      i = next(i)
    }
    range.push(end)

    return range

  }
}

module.exports = Range
