const {
  pipeParsers,
  sequenceOf,
  choice,
  takeLeft,
  many1,
  possibly,
  mapTo
} = require("arcsecond")

const {
  colon
} = require("./convenience/tokens")

const {
  whitespace,
  whitespaced
} = require("./convenience/whitespace")

const key = require("./key")
const expressions = require("./expressions/expressions")

const Assignment = require("../tree/expressions/Assignment")

// @TODO: Optional key statement
const assignment = pipeParsers([
  sequenceOf([
    choice([
      takeLeft(many1(takeLeft(whitespaced(key))(colon)))(
        sequenceOf([
          colon,
          possibly(whitespace)
        ])
      ),
      takeLeft(key)(whitespaced(colon))
    ]),
    expressions
  ]),
  mapTo(([keys, expressions]) => new Assignment(keys, expressions))
])

module.exports = assignment
