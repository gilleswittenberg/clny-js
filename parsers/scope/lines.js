const {
  many1,
  pipeParsers,
  sequenceOf,
  many,
  possibly,
  mapTo,
  parse,
  toValue
} = require("arcsecond")

const {
  eol,
  indent
} = require("../convenience/whitespace")

const {
  anyCharsExceptEOL
} = require("../convenience/convenience")

const comment = require("../comment")

const Line = require("../../tree/Line")

const charsToString = require("../../utils/charsToString")

// lines, indention, scope
const lineContent = pipeParsers([
  anyCharsExceptEOL,
  mapTo(charsToString)
])
const line = pipeParsers([
  sequenceOf([
    many(indent),
    lineContent,
    possibly(eol)
  ]),
  mapTo(([indents, content]) => {
    const indention = indents.length
    return new Line(content, 0, indention)
  })
])
const lines = pipeParsers([
  many1(line),
  mapTo(lines => {

    // set line numbers
    lines.map((line, index) => {
      line.lineNumber = index + 1
      return line
    })

    // remove empty lines
    const nonEmptyLines = lines.filter(line => line.isEmpty === false)

    // remove comments
    const nonCommentLines = nonEmptyLines.filter(line => {
      // @TODO: ? Is it clean to call parse here
      try {
        toValue(parse(comment)(line.chars))
        return false
      } catch (err) {
        return true
      }
    })

    return nonCommentLines
  })
])

module.exports = lines
