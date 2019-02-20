const {
  pipeParsers,
  sequenceOf,
  possibly,
  choice,
  mapTo,
} = require("arcsecond")

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
const typeLiteral = require("../types/typeLiteral")

const Expression = require("../../tree/Expression")

const expression = pipeParsers([
  wrappedInParentheses(
    sequenceOf([
      possibly(
        pipeParsers([
          sequenceOf([
            typeLiteral,
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
  mapTo(([,, expression]) => new Expression(expression))
])

module.exports = expression
