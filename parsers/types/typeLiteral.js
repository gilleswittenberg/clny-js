const {
  letters,
  regex,
  pipeParsers,
  sequenceOf,
  possibly,
  mapTo
} = require("arcsecond")

const uppercase = regex(/^[A-Z]/)
const typeLiteral = pipeParsers([
  sequenceOf([
    uppercase,
    possibly(letters)
  ]),
  mapTo(([first, chars]) => first + (chars ? chars : ""))
])

module.exports = typeLiteral
