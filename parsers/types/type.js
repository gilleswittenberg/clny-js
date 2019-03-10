const {
  choice,
  pipeParsers,
  sequenceOf,
  possibly,
  mapTo,
  sepBy1
} = require("arcsecond")

const {
  whitespaced
} = require("../convenience/whitespace")

const {
  wrappedInParentheses,
  optionalWrappedInParentheses
} = require("../convenience/wrapped")

const {
  colon,
  comma,
  pipe,
  arrow
} = require("../convenience/tokens")

const key = require("../key")
const typeLiteral = require("./typeLiteral")
const wrappedTypeLiteral = optionalWrappedInParentheses(typeLiteral)

// @TODO: Aliases
const namedType = type => pipeParsers([
  sequenceOf([
    possibly(
      pipeParsers([
        sequenceOf([
          key,
          whitespaced(colon)
        ]),
        mapTo(([key]) => key)
      ])
    ),
    type
  ]),
  mapTo(([key, type]) => [key, type])
])

const sumType = optionalWrappedInParentheses(
  sepBy1(whitespaced(pipe))(wrappedTypeLiteral)
)
const productType = optionalWrappedInParentheses(
  sepBy1(whitespaced(comma))(optionalWrappedInParentheses(namedType(sumType)))
)

const types = choice([
  namedType(
    wrappedInParentheses(productType)
  ),
  productType
])

const functionType = pipeParsers([
  sequenceOf([
    types,
    whitespaced(arrow),
    types
  ]),
  mapTo(([args,,types]) => [args, types])
])

const type = choice([
  functionType,
  types
])

module.exports = type
