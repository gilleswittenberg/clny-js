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
      mapTo(key => [key, false])
    ]),
    pipeParsers([
      sequenceOf([dot, key]),
      mapTo(([,key]) => [key, true])
    ]),
    pipeParsers([
      dot,
      mapTo(() => [null, true])
    ])
  ]),
  mapTo(([key, isSelf]) => new Identity(key, isSelf))
])

module.exports = identity
