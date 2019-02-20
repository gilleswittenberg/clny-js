const {
  sequenceOf,
  choice,
  pipeParsers,
  mapTo,
  str,
  many,
  anythingExcept,
  everythingUntil,
  lookAhead,
} = require("arcsecond")

const {
  numberSign
} = require("./convenience/tokens")

const {
  anyChars,
  escapedBackslash
} = require("./convenience/convenience")

const {
  newline,
  indent
} = require("./convenience/whitespace")

const charsToString = require("../utils/charsToString")

// single line comment
const commentEOL = sequenceOf([
  numberSign,
  pipeParsers([
    anyChars,
    mapTo(charsToString)
  ])
])

// closed comment
const escapedNumberSign = sequenceOf([escapedBackslash, numberSign])
const commentClosed = sequenceOf([
  numberSign,
  everythingUntil(escapedNumberSign),
  escapedNumberSign
])

// multiline comment
const newlineWithoutIndention = sequenceOf([
  newline,
  lookAhead(anythingExcept(indent))
])

const commentMultiline = sequenceOf([
  numberSign,
  pipeParsers([
    many(anythingExcept(newlineWithoutIndention)),
    mapTo(charsToString)
  ])
])

const comment = choice([
  commentClosed,
  commentMultiline,
  commentEOL
])

module.exports = comment
