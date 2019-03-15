const {
  pipeParsers,
  mapTo,
  sequenceOf,
  many,
  possibly,
  anythingExcept,
  choice,
  parse,
  toValue
} = require("arcsecond")

const {
  escapedBackslash,
  numberSign
} = require("../parsers/convenience/tokens")

const charsToString = require("../utils/charsToString")

const escapedNumberSign = sequenceOf([escapedBackslash, numberSign])

const Comment = require("./Comment")
const Identity = require("./expressions/Identity")
const ScopeOpener = require("./ScopeOpener")
const TypeOpener = require("./TypeOpener")
const TypeConstructor = require("./TypeConstructor")

const comment = pipeParsers([
  sequenceOf([
    numberSign,
    many(anythingExcept(escapedNumberSign)),
    possibly(escapedNumberSign)
  ]),
  mapTo(sequence => new Comment(charsToString(sequence)))
])

const commentsFilter = many(
  choice([
    comment,
    many(anythingExcept(numberSign))
  ])
)

class Line {

  constructor (chars, lineNumber, indents = 0) {
    this.chars = chars
    this.lineNumber = lineNumber
    this.indents = indents
    // @TODO: This is not always set correctly
    this.parsedComments = this.parseComments(chars)
    this.content = charsToString(this.parsedComments)
    this.isComment = this.parsedComments.length === 1 && this.parsedComments[0] instanceof Comment
    this.isEmpty = this.isComment === false && this.content.trim() === ""
  }

  parseComments (chars) {
    return this.filterComments(chars.trim())
  }

  filterComments (chars) {
    try {
      return toValue(parse(commentsFilter)(chars))
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  setParsedContent (parsedContent) {
    this.parsedContent = parsedContent
    // @TODO: Remove TypeOpener
    const scopeOpeners = [Identity, ScopeOpener, TypeOpener, TypeConstructor]
    this.canOpenScope = scopeOpeners.reduce((acc, opener) => acc || this.parsedContent instanceof opener, false)
  }
}

module.exports = Line
