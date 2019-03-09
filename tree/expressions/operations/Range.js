const Operation = require("./Operation")
const Number = require("../scalars/Number")

class Range extends Operation {

  constructor (start, end) {
    super("INFIX", ",,", start, end)
  }

  evaluate () {
    if (this.isEvaluated) return this.value

    const start = this.operands[0]
    const end = this.operands[1]
    const range = this.createRange(start, end)

    const expressions = range.map(n => new Number(n))
    this.addExpressions(expressions)

    this.value = this.expressions.map(expression => expression.evaluate())
    this.isEvaluated = true
    return this.value
  }

  createRange (start, end) {

    if (start == null || end == null) throw "Invalid Range start or end"

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
