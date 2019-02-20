const {
  pipeParsers,
  sequenceOf,
  possibly,
  choice,
  between,
  mapTo,
} = require("arcsecond")

const {
  leftParens,
  rightParens
} = require("../convenience/tokens")

const {
  whitespace
} = require("../convenience/whitespace")

const {
  wrappedInParentheses
} = require("../convenience/convenience")

const nullParser = require("./null")
const boolean = require("./boolean")
const number = require("./number")
const string = require("./string")
const type = require("../types/typeLiteral")

const Expression = require("../../tree/Expression")

const expression = pipeParsers([
  wrappedInParentheses(
    sequenceOf([
      possibly(
        pipeParsers([
          sequenceOf([
            type,
            whitespace
          ]),
          mapTo(([type]) => type)
        ])
      ),
      choice([
        nullParser,
        boolean,
        number,
        string
      ])
    ])
  ),
  mapTo(([type, expression]) => new Expression(expression))
])

module.exports = expression
