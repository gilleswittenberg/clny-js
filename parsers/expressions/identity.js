const {
  pipeParsers,
  mapTo
} = require("arcsecond")

const key = require("../scope/key")
const Identity = require("../../tree/expressions/Identity")

const identity = pipeParsers([
  key,
  mapTo(key => new Identity(key))
])

module.exports = identity
