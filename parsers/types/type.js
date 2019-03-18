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

const Type = require("../../tree/Type")


const wrappedTypeLiteral = pipeParsers([
  optionalWrappedInParentheses(typeLiteral),
  mapTo(type => new Type (type))
])

const sumType = pipeParsers([
  optionalWrappedInParentheses(
    sepBy1(whitespaced(pipe))(wrappedTypeLiteral)
  ),
  mapTo(types => {
    if (types.length === 1) return types[0]
    return new Type (null, types)
  })
])

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
  mapTo(([key, type]) => {
    if (key == null) return type
    const name = type.name
    const options = type.options
    const types = type.types
    const inputTypes = type.inputTypes
    return new Type (name, options, types, inputTypes, key)
  })
])

const productType = pipeParsers([
  optionalWrappedInParentheses(
    sepBy1(whitespaced(comma))(optionalWrappedInParentheses(namedType(sumType)))
  ),
  mapTo(types => {
    if (types.length === 1) return types[0]
    return new Type (null, null, types)
  })
])

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
  mapTo(([inputType,,type]) => {
    const types = type.isCompound ? type.types : type
    const inputTypes = inputType.isCompound ? inputType.types : inputType
    return new Type (null, null, types, inputTypes)
  })
])

const type = choice([
  functionType,
  types
])

module.exports = {
  functionType,
  types,
  type
}
