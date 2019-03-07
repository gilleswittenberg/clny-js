const {
  takeLeft
} = require("arcsecond")

const {
  whitespaced
} = require("./convenience/whitespace")

const {
  colon
} = require("./convenience/tokens")

const key = require("./key")

const keyPrefix = takeLeft(key)(whitespaced(colon))

module.exports = keyPrefix
