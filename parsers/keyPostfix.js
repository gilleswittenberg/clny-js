const {
  takeRight
} = require("arcsecond")

const {
  dot
} = require("./convenience/tokens")

const key = require("./key")

// @TODO: Whitespace
// @TODO: New line
const keyPostfix = takeRight(dot)(key)

module.exports = keyPostfix
