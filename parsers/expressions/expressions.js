const {
  choice,
  pipeParsers,
  sequenceOf,
  many,
  mapTo
} = require("arcsecond")

const { wrappedInParentheses } = require("../convenience/convenience")
const { comma } = require("../convenience/tokens")
const { whitespaced } = require("../convenience/whitespace")
const range = require("./range")

const expression = require("./expression")

// Alternative sepBy1
const expressions = wrappedInParentheses(
  choice([
    range,
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
  ])
)

module.exports = expressions
