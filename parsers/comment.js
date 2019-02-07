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

  // tests
  toValue,
  parse
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

// tests
const assert = require("assert").strict

const contentEOL = `#comment
5`
assert.equal(toValue(parse(comment)(contentEOL))[1], "comment")

const contentEOLSemicolon = "# comment; "
assert.equal(toValue(parse(comment)(contentEOLSemicolon))[1], " comment; ")

const contentClosed = "# comment \\# expression"
assert.equal(toValue(parse(comment)(contentClosed))[1], " comment ")

const contentMultiline = `# comment
  multiline
  line 3
expression`
assert.equal(toValue(parse(comment)(contentMultiline))[1], " comment\n  multiline\n  line 3")
