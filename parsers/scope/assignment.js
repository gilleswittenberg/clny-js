const {
  pipeParsers,
  sequenceOf,
  many1,
  mapTo
} = require("arcsecond")

const {
  colon
} = require("../convenience/tokens")

const {
  whitespaced
} = require("../convenience/whitespace")

const {
  wrappedInParentheses
} = require("../convenience/convenience")

const key = require("./key")
const expressions = require("../expressions/expressions")

const Assignment = require("../../tree/expressions/Assignment")

const assignment = wrappedInParentheses(
  pipeParsers([
    sequenceOf([
      many1(
        pipeParsers([
          sequenceOf([
            key,
            whitespaced(colon)
          ]),
          mapTo(([key]) => key)
        ])
      ),
      expressions
    ]),
    mapTo(([keys, expressions]) => new Assignment(keys, expressions))
  ])
)

module.exports = assignment
