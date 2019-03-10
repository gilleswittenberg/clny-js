const {
  composeParsers
} = require("arcsecond")

const times = (parser, n) =>
  composeParsers(Array(n).fill(parser))

module.exports = times
