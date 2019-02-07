const {
  composeParsers,
} = require("arcsecond")

const times = (parser, n) => {
  return composeParsers(Array(n).fill(parser))
}

module.exports = times
