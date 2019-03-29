const {
  char,
  choice,
  many,
  lookAhead,
  sequenceOf,
  endOfInput,
  possibly,
  pipeParsers,
  takeLeft,
  mapTo,
  parse,
  toValue
} = require("arcsecond")

const {
  colon
} = require("./convenience/tokens")

const {
  indent,
  whitespace,
  whitespaced
} = require("./convenience/whitespace")

const {
  anyChars,
  anyCharsExceptEOL
} = require("./convenience/convenience")

const charsToString = require("../utils/charsToString")

const key = require("./key")
const typeLiteral = require("./types/typeLiteral")
const assignment = require("./assignment")
const typeConstructor = require("./types/typeConstructor")
const { type, functionType } = require("./types/type")
const eol = char("\n")

const linesToScopes = require("./linesToScopes")

const Indent = require("../tree/Indent")
const ScopeOpener = require("../tree/ScopeOpener")
const TypeOpener = require("../tree/TypeOpener")
const DataScope = require("../tree/expressions/scopes/DataScope")
const FunctionScope = require("../tree/expressions/scopes/FunctionScope")
const Line = require("../tree/Line")
const Gibberish = require("../tree/Gibberish")

const indents = pipeParsers([
  many(indent),
  mapTo(indents => new Indent(indents))
])

// @TODO: Optional colon
const scopeOpener = pipeParsers([
  sequenceOf([
    key,
    whitespaced(colon),
    possibly(whitespaced(functionType)),
    endOfInput
  ]),
  mapTo(([key, , functionType]) => new ScopeOpener(key, functionType))
])

// @TODO: Optional colon
const typeOpener = pipeParsers([
  sequenceOf([
    typeLiteral,
    whitespaced(colon),
    endOfInput
  ]),
  mapTo(([name]) => new TypeOpener(name))
])

const gibberish = pipeParsers([
  anyChars,
  mapTo(chars => new Gibberish(charsToString(chars)))
])

const tillEndOfLine = parser =>
  pipeParsers([
    sequenceOf([
      parser,
      whitespace,
      endOfInput
    ]),
    mapTo(([parser]) => parser)
  ])

// @TODO: Wrap in whitspace
const lineContent = choice([
  typeOpener,
  scopeOpener,
  assignment,
  tillEndOfLine(typeConstructor),
  // @TODO: Remove when assignment or expressions can handle `key: String`
  tillEndOfLine(type),
  gibberish
])

const line = pipeParsers([
  sequenceOf([
    indents,
    pipeParsers([anyCharsExceptEOL, mapTo(charsToString)]),
    choice([eol, lookAhead(endOfInput)])
  ]),
  mapTo(([indent, chars]) => [chars, indent])
])

const linesParser = Scope => pipeParsers([
  takeLeft(many(line))(endOfInput),
  mapTo(linesChars => {
    const lines = linesChars.map((line, index) => new Line(line[1].chars + line[0], index + 1, line[1].level))
    // @TODO: Move into Line
    const parsedLines = lines.map(line => {
      let parsedContent = ""
      // @TODO: parse lines after comments have been filtered out
      if (line.content !== "") {
        try {
          parsedContent = toValue(parse(lineContent)(line.content))
        } catch (err) {
          throw err
        }
      }
      line.setParsedContent(parsedContent)
      return line
    })

    return linesToScopes(Scope, parsedLines)
  })
])

module.exports = (data = false) => {
  const Scope = data ? DataScope : FunctionScope
  return linesParser(Scope)
}
