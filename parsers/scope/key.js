const {
  letters,
  regex,
  sequenceOf,
  possibly,
  pipeParsers,
  mapTo,
} = require("arcsecond")

const lowercase = regex(/^[a-z]/)
const key = pipeParsers([
  sequenceOf([
    lowercase,
    possibly(letters)
  ]),
  mapTo(([first, chars]) => first + (chars ? chars : ""))
])

module.exports = key
