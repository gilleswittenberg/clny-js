const {
  pipeParsers,
  sequenceOf,
  possibly,
  mapTo
} = require("arcsecond")

const {
  leftParens,
  rightParens
} = require("../convenience/tokens")

const {
  whitespace
} = require("../convenience/whitespace")

const Expression = require("../../tree/expressions/Expression")

const empty = pipeParsers([
  sequenceOf([
    leftParens,
    possibly(whitespace),
    rightParens
  ]),
  mapTo(() => new Expression())
])

module.exports = empty
