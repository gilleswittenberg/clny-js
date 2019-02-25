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
  wrappedInParentheses
} = require("../convenience/convenience")

const { type: typeKeyword } = require("../keywords")
const typeLiteral = require("./typeLiteral")
const type = require("./type")

const typeAssignment = wrappedInParentheses(
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
