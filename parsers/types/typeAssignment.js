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
const type = require("./type")

const typeAssignment = optionalWrappedInParentheses(
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
    mapTo(([,name, type]) => type != null ? [name, type] : [name])
  ])
)

module.exports = typeAssignment
