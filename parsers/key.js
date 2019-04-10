const {
  choice,
  letters,
  regex,
  sequenceOf,
  possibly,
  pipeParsers,
  mapTo
} = require("arcsecond")

const {
  underscore,
  quote
} = require("./convenience/tokens")

const charsToString = require("../utils/charsToString")

const Key = require("../tree/Key")

const prefix = choice([underscore, quote])
const lowercase = regex(/^[a-z]/)
const key = pipeParsers([
  sequenceOf([
    possibly(prefix),
    lowercase,
    possibly(letters)
  ]),
  mapTo(([prefix, first, chars]) => new Key(charsToString(first, chars), prefix))
])

module.exports = key
