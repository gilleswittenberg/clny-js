const {
  pipeParsers,
  str,
  mapTo
} = require("arcsecond")

const Expression = require("../../tree/Expression")

const nullParser = pipeParsers([
  str("null"),
  mapTo(() => new Expression("null", "Null"))
])

module.exports = nullParser
