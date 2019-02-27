const {
  letters,
  regex,
  sequenceOf,
  possibly,
  pipeParsers,
  mapTo
} = require("arcsecond")

const charsToString = require("../../utils/charsToString")

const lowercase = regex(/^[a-z]/)
const key = pipeParsers([
  sequenceOf([
    lowercase,
    possibly(letters)
  ]),
  mapTo(([first, chars]) => charsToString(first, chars))
])

module.exports = key
