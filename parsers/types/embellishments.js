const {
  choice,
  sequenceOf,
  possibly
} = require("arcsecond")

const {
  exclamationMark,
  questionMark,
  caret,
  atSign,
  dollarSign
} = require("../convenience/tokens")

const embellishment = choice([
  exclamationMark,
  questionMark,
  caret,
  atSign,
  dollarSign
])

const embellish = parser =>
  sequenceOf([
    parser,
    possibly(embellishment)
  ])

module.exports = {
  embellishment,
  embellish
}
