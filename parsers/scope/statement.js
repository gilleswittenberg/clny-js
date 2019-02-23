const {
  sequenceOf,
  pipeParsers,
  mapTo
} = require("arcsecond")

const { whitespace } = require("../convenience/whitespace")
const { "return": returnStatement } = require("../keywords")
const expressions = require("../expressions/expressions")

const Statement = require("../../tree/Statement")

const statement = pipeParsers([
  sequenceOf([
    returnStatement,
    whitespace,
    expressions
  ]),
  mapTo(([statement,, expressions]) => new Statement(statement, expressions))
])

module.exports = statement
