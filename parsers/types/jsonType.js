const {
  choice,
  str
} = require("arcsecond")

const { types, plurals } = require("../../tree/types")
const jsonType = choice(types.map(type => str(type)))
const jsonTypePlural = choice(plurals.map(plural => str(plural)))

module.exports = {
  jsonType,
  jsonTypePlural
}
