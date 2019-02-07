const {
  pipeParsers,
  sequenceOf,
  many,
  mapTo,
  sepBy1,

  // tests
  parse,
  toValue
} = require("arcsecond")
const assert = require("assert").strict

const {
  wrappedInParentheses
} = require("../convenience/convenience")

const { comma } = require("../convenience/tokens")
const { whitespaced } = require("../convenience/whitespace")

const expression = require("./expression")

// Alternative sepBy1
const expressions = wrappedInParentheses(
  pipeParsers([
    sequenceOf([
      expression,
      many(
        pipeParsers([
          sequenceOf([
            whitespaced(comma),
            expression
          ]),
          mapTo(([, expression]) => expression)
        ])
      )
    ]),
    mapTo(([expression, expressions]) => [expression].concat(expressions))
  ])
)

module.exports = expressions


// tests

const single = toValue(parse(expressions)("5"))
assert.equal(single.length, 1)

const list = toValue(parse(expressions)("6, 7, 8"))
assert.equal(list.length, 3)

const listParens = toValue(parse(expressions)("(7, 8, 9, 10 )"))
assert.equal(listParens.length, 4)
