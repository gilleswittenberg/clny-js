const {
  pipeParsers,
  sequenceOf,
  mapTo
} = require("arcsecond")

const { whitespaced } = require("../convenience/whitespace")
const { rangeDelimiter } = require("../convenience/tokens")
// @TODO: Allow only ints
const number = require("./numbers/number")

const Number = require("../../tree/expressions/scalars/Number")

// @TODO: Move to (Range extends Expression)
const createRange = (start, end) => {
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

// @TODO: floats, alphabetical, steps
const range = pipeParsers([
  sequenceOf([
    number,
    whitespaced(rangeDelimiter),
    number
  ]),
  mapTo(([start,,end]) => {
    const startValue = start.evaluate()
    const endValue = end.evaluate()
    const range = createRange(startValue, endValue).map(n => new Number(n))
    return range
  })
])

module.exports = range
