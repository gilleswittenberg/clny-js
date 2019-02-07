const {
  many1,
  pipeParsers,
  sequenceOf,
  many,
  possibly,
  mapTo,

  // tests
  parse,
  toValue
} = require("arcsecond")
const assert = require("assert").strict

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
      const result = parse(comment)(line.chars)
      // @TODO: ? Is this a right check for Either
      return result.value[0] === 0
    })

    return nonCommentLines
  })
])


// tests

// lines
const linesContentSemicolon = "kk: 78; ll: 89"
const linesSeperatedBySemicolon = toValue(parse(lines)(linesContentSemicolon))
assert.equal(linesSeperatedBySemicolon.length, 2)

const linesContentEOL = `kk: 78
ll: 89
mm: 90
`
const linesSeperatedByEOL = toValue(parse(lines)(linesContentEOL))
assert.equal(linesSeperatedByEOL.length, 3)

// indention
const linesContentIndented = `
# comment
kk
  ll: 89
  mm: 90
`
const linesIndented = toValue(parse(lines)(linesContentIndented))
assert.equal(linesIndented.length, 3)
