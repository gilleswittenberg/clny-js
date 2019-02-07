const {
  pipeParsers,
  sequenceOf,
  possibly,
  choice,
  mapTo,

  // tests
  parse,
  toValue
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

// tests

const assert = require("assert").strict

assert.deepEqual(toValue(parse(typeAssignment)("type Null")), ["Null"])
assert.deepEqual(toValue(parse(typeAssignment)("False")), ["False"])
assert.deepEqual(toValue(parse(typeAssignment)("Boolean: False | True")), ["Boolean", [[null, ["False", "True"]]]])
