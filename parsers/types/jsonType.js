const {
  choice,
  str
} = require("arcsecond")

const types = require("../../tree/types")
const jsonType = choice(types.map(type => str(type)))

module.exports = jsonType
