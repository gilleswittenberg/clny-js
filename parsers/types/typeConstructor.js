const {
  pipeParsers,
  sequenceOf,
  possibly,
  mapTo
} = require("arcsecond")

const {
  colon
} = require("../convenience/tokens")

const {
  whitespace,
  whitespaced
} = require("../convenience/whitespace")

const {
  optionalWrappedInParentheses
} = require("../convenience/wrapped")

const { type: typeKeyword } = require("../keywords")
const typeLiteral = require("./typeLiteral")
const { type } = require("./type")

const TypeConstructor = require("../../tree/TypeConstructor")

const typeConstructor = optionalWrappedInParentheses(
  pipeParsers([
    sequenceOf([
      possibly(
        sequenceOf([
          typeKeyword,
          whitespace
        ])
      ),
      typeLiteral,
      possibly(
        pipeParsers([
          sequenceOf([
            whitespaced(colon),
            type
          ]),
          mapTo(([,type]) => type)
        ])
      )
    ]),
    mapTo(([,name, type]) => new TypeConstructor(name, type))
  ])
)

module.exports = typeConstructor
