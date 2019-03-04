const {
  pipeParsers,
  str,
  mapTo
} = require("arcsecond")

const Null = require("../../../tree/expressions/scalars/Null")

const nullParser = pipeParsers([
  str("null"),
  mapTo(str => new Null(null, str))
])

module.exports = nullParser
