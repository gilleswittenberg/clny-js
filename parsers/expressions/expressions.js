const {
  choice,
  pipeParsers,
  sequenceOf,
  possibly,
  many,
  mapTo
} = require("arcsecond")

const { wrappedInParentheses } = require("../convenience/convenience")
const { comma } = require("../convenience/tokens")
const { whitespace, whitespaced } = require("../convenience/whitespace")
const { jsonTypePlural } = require("../types/jsonType")
const range = require("./range")

const { getSingle } = require("../../tree/types")
const expression = require("./expression")

// Alternative sepBy1
const expressions = wrappedInParentheses(
  pipeParsers([
    sequenceOf([
      possibly(
        pipeParsers([
          sequenceOf([
            // @TODO: Allow user assigned types
            //typeLiteral,
            jsonTypePlural,
            whitespace
          ]),
          mapTo(([type]) => type)
        ])
      ),
      choice([
        range,
        pipeParsers([
          sequenceOf([
            expression,
            many(
              pipeParsers([
                sequenceOf([
                  whitespaced(comma),
                  expression
                ]),
                mapTo(([, expression]) => expression)
              ])
            )
          ]),
          mapTo(([expression, expressions]) => [expression].concat(expressions))
        ])
      ])
    ]),
    mapTo(([type, expressions]) => {
      if (type != null) {
        const single = getSingle(type)
        return expressions.map(expression => expression.castTo(single))
      }
      return expressions
    })
  ])
)

module.exports = expressions
