const {
  choice,
  between,
  pipeParsers,
  sequenceOf,
  possibly,
  mapTo,
  sepBy1,
} = require("arcsecond")

const {
  whitespaced
} = require("../convenience/whitespace")

const {
  wrappedInParentheses
} = require("../convenience/convenience")

const {
  colon,
  comma,
  pipe,
  leftParens,
  rightParens,
  arrow
} = require("../convenience/tokens")

const key = require("../scope/key")
const typeLiteral = require("./typeLiteral")
const wrappedTypeLiteral = wrappedInParentheses(typeLiteral)

//const Type = require("../../tree/Type")

// @TODO: Aliases
const namedType = type => pipeParsers([
  sequenceOf([
    possibly(
      pipeParsers([
        sequenceOf([
          key,
          whitespaced(colon),
        ]),
        mapTo(([key]) => key)
      ])
    ),
    type
  ]),
  mapTo(([key,type]) => ([key, type]))
  //mapTo(([key,type]) => (new Type(null, type, null, null, key)))
])

const sumType = wrappedInParentheses(
  sepBy1(whitespaced(pipe))(wrappedTypeLiteral)
)
const productType = wrappedInParentheses(
  sepBy1(whitespaced(comma))(wrappedInParentheses(namedType(sumType)))
)

const types = choice([
  namedType(
    // @TODO: Abstract required parentheses
    between(whitespaced(leftParens))(whitespaced(rightParens))(
      productType
    )
  ),
  productType
])

const functionType = pipeParsers([
  sequenceOf([
    types,
    whitespaced(arrow),
    types
  ]),
  mapTo(([args,,types]) => ([args, types]))
])

const type = choice([
  functionType,
  types
])

module.exports = type
