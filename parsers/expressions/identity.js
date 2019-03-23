const {
  pipeParsers,
  choice,
  sequenceOf,
  mapTo
} = require("arcsecond")

const {
  dot
} = require("../convenience/tokens")

const key = require("../key")
const Identity = require("../../tree/expressions/Identity")

const identity = pipeParsers([
  choice([
    key,
    pipeParsers([
      sequenceOf([dot, key]),
      mapTo(([dot, key]) => dot + key)
    ]),
    dot
  ]),
  mapTo(key => new Identity(key))
])

module.exports = identity
