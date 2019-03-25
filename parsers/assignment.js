const {
  sequenceOf,
  choice,
  takeLeft,
  many1,
  possibly,
  pipeParsers,
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

// @TODO: Optional key, type statement
const assignment = pipeParsers([
  sequenceOf([
    possibly(
      choice([
        // aliased assignment eg. `key: alias:: expressions`
        takeLeft(many1(takeLeft(whitespaced(key))(colon)))(
          sequenceOf([
            colon,
            possibly(whitespace)
          ])
        ),
        // single key assignment eg. `key: expressions`
        takeLeft(key)(whitespaced(colon))
      ]),
    ),
    whitespaced(expressions)
  ]),
  mapTo(([keys, expressions]) => keys != null ? new Assignment(keys, expressions) : expressions)
])

module.exports = assignment
