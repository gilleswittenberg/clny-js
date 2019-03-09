const {
  letters,
  regex,
  pipeParsers,
  sequenceOf,
  possibly,
  mapTo
} = require("arcsecond")

const charsToString = require("../../utils/charsToString")

const uppercase = regex(/^[A-Z]/)
const typeLiteral = pipeParsers([
  sequenceOf([
    uppercase,
    possibly(letters)
  ]),
  mapTo(chars => charsToString(chars))
])

module.exports = typeLiteral
