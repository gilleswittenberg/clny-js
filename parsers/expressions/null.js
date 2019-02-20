const {
  pipeParsers,
  str,
  mapTo,
} = require("arcsecond")

const nullParser = pipeParsers([
  str("null"),
  mapTo(() => null)
])

module.exports = nullParser
