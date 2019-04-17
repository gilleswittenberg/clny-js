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
const { embellish } = require("./embellishments")

const Type = require("../../tree/types/Type")
const Embellishment = require("../../tree/types/Embellishment")

const embellishedType = pipeParsers([
  embellish(typeLiteral),
  mapTo(([typeLiteral, embellishmentPostfix]) => {
    const embellishment = embellishmentPostfix != null ? new Embellishment(embellishmentPostfix) : null
    return new Type (typeLiteral, null, null, null, null, embellishment)
  })
])

const wrappedTypeLiteral = optionalWrappedInParentheses(embellishedType)

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
    const { name, options, types, inputTypes } = type
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
  type,
  typeLiteral: wrappedTypeLiteral
}
