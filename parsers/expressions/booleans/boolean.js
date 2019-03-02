const {
  pipeParsers,
  str,
  mapTo,
  choice
} = require("arcsecond")

const Boolean = require("../../../tree/expressions/scalars/Boolean")

const boolean = pipeParsers([
  choice([
    str("false"),
    str("true")
  ]),
  mapTo(str => new Boolean(null, str))
])

module.exports = boolean
