const {
  pipeParsers,
  str,
  mapTo,
  choice,
} = require("arcsecond")

const Expression = require("../../tree/Expression")

const boolean = pipeParsers([
  choice([
    str("false"),
    str("true")
  ]),
  mapTo(str => new Expression(str, "Boolean"))
])

module.exports = boolean
