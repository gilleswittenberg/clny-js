const {
  pipeParsers,
  sequenceOf,
  possibly,
  choice,
  between,
  mapTo,

  // tests
  parse,
  toValue
} = require("arcsecond")
const assert = require("assert").strict

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

// tests
assert.equal(toValue(parse(expression)("null")).value.type, "Null")
assert.equal(toValue(parse(expression)("( null ) ")).value.value, null)

assert.equal(toValue(parse(expression)("true")).value.type, "Boolean")
assert.equal(toValue(parse(expression)("( true ) ")).value.value, true)

assert.equal(toValue(parse(expression)("5")).value.type, "Number")
assert.equal(toValue(parse(expression)("5")).value.value, 5)
assert.equal(toValue(parse(expression)("(5)")).value.value, 5)
assert.equal(toValue(parse(expression)("( 5 ) ")).value.value, 5)

assert.equal(toValue(parse(expression)(`"ab"`)).value.type, "String")
assert.equal(toValue(parse(expression)(`( "ab" )`)).value.value, "ab")

assert.equal(toValue(parse(expression)("Number 5")).value.value, 5)
