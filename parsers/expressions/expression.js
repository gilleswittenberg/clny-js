const {
  pipeParsers,
  sequenceOf,
  possibly,
  choice,
  mapTo
} = require("arcsecond")

const {
  whitespace
} = require("../convenience/whitespace")

const {
  wrappedInParentheses
} = require("../convenience/convenience")

const nullParser = require("./null")
const boolean = require("./boolean")
const number = require("./numbers/arithmetic")
const string = require("./strings/string")
//const typeLiteral = require("../types/typeLiteral")
const { jsonType } = require("../types/jsonType")

const expression = wrappedInParentheses(
  pipeParsers([
    sequenceOf([
      possibly(
        pipeParsers([
          sequenceOf([
            // @TODO: Allow user assigned types
            //typeLiteral,
            jsonType,
            whitespace
          ]),
          mapTo(([type]) => type)
        ])
      ),
      choice([
        nullParser,
        boolean,
        number,
        string
      ])
    ]),
    mapTo(([type, expression]) => type != null ? expression.castTo(type) : expression)
  ])
)

module.exports = expression
