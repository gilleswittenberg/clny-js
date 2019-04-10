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
    pipeParsers([
      key,
      mapTo(key => key.name)
    ]),
    pipeParsers([
      sequenceOf([dot, key]),
      mapTo(([dot, key]) => dot + key.name)
    ]),
    dot
  ]),
  mapTo(str => new Identity(str))
])

module.exports = identity
