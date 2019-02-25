const {
  pipeParsers,
  sequenceOf,
  mapTo
} = require("arcsecond")

const { whitespaced } = require("../convenience/whitespace")
const { rangeDelimiter } = require("../convenience/tokens")
// @TODO: Allow only ints
const { numberLiteral } = require("./number")

const Expression = require("../../tree/Expression")

// @TODO: Move to (Range extends Expression)
const createRange = (start, end) => {
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
    numberLiteral,
    whitespaced(rangeDelimiter),
    numberLiteral
  ]),
  mapTo(([start,, end]) => createRange(parseInt(start), parseInt(end)).map(n => new Expression(n)))
])

module.exports = range
