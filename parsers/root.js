const {
  char,
  choice,
  many,
  lookAhead,
  sequenceOf,
  endOfInput,
  pipeParsers,
  mapTo,
  parse,
  toValue
} = require("arcsecond")

const {
  colon
} = require("./convenience/tokens")

const {
  indent,
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
const expressions = require("./expressions/expressions")
const eol = char("\n")

const Indent = require("../tree/Indent")
const ScopeOpener = require("../tree/ScopeOpener")
const TypeOpener = require("../tree/TypeOpener")
const DataScope = require("../tree/expressions/DataScope")
const TypeScope = require("../tree/TypeScope")
const FunctionScope = require("../tree/expressions/FunctionScope")
const TypeConstructor = require("../tree/TypeConstructor")
const Line = require("../tree/Line")
const Gibberish = require("../tree/Gibberish")

const indents = pipeParsers([
  many(indent),
  mapTo(indents => new Indent(indents))
])

const scopeOpener = pipeParsers([
  sequenceOf([
    key,
    whitespaced(colon)
  ]),
  mapTo(([key]) => new ScopeOpener(key))
])

const typeOpener = pipeParsers([
  sequenceOf([
    typeLiteral,
    whitespaced(colon)
  ]),
  mapTo(([name]) => new TypeOpener(name))
])

const gibberish = pipeParsers([
  anyChars,
  mapTo(chars => new Gibberish(chars))
])

const lineContent = choice([
  assignment,
  typeConstructor,
  expressions,
  scopeOpener,
  typeOpener,
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

const mapLinesToScopes = lines => {

  const rootScope = scopeConstructor(null, null, true)
  const scopes = [rootScope]
  const currentScope = () => scopes[scopes.length - 1]
  const currentIndents = () => scopes.length - 1
  let commentIndents = null

  lines.forEach(line => {

    const content = line.parsedContent
    const indents = line.indents

    // empty line
    if (line.isEmpty) return

    // inside multiline comment
    if (commentIndents != null && indents > commentIndents) return

    // close multiline comment
    commentIndents = null

    // open multiline comment
    if (line.isComment) {
      commentIndents = indents
      return
    }

    // default content (not part of multiline comment)
    if (content instanceof Gibberish)
      throw new Error ("Invalid characters at line: " + line.lineNumber)


    // indention check
    if (indents > currentIndents())
      throw new Error ("Invalid indention at line: " + line.lineNumber)

    // new scope
    if (content instanceof ScopeOpener) {
      const newScope = scopeConstructor(content.key)
      scopes.push(newScope)
      return
    }

    // new type scope
    if (content instanceof TypeOpener) {
      const typeScope = new TypeScope(content.name)
      scopes.push(typeScope)
      return
    }

    // close scope
    if (indents === currentIndents() - 1) {
      const scope = scopes.pop()
      if (scope.isEmpty) throw new Error ("Scope opened without adding expressions")
      currentScope().addExpressions(scope)
    }

    // type constructor
    if (content instanceof TypeConstructor) {
      currentScope().addType(content.name, content.type)
      return
    }

    // current scope
    if (indents === currentIndents()) {
      currentScope().addExpressions(content)
    }
  })

  // collapse scopes
  return scopes.reverse().reduce((acc, scope) => {
    if (acc == null) return scope
    scope.addExpressions(acc)
    return scope
  })
}

const linesParser = pipeParsers([
  sequenceOf([
    many(line),
    endOfInput
  ]),
  mapTo(([linesChars]) => {
    const lines = linesChars.map((line, index) => new Line(line[1].chars + line[0], index + 1, line[1].level))
    const parsedLines = lines.map(line => {
      try {
        line.parsedContent = toValue(parse(lineContent)(line.content))
      } catch (err) {
        throw err
      }
      return line
    })
    return mapLinesToScopes(parsedLines)
  })
])

let asData
const scopeConstructor = (keys, expressions, isRoot) => {
  const constructor = asData ? DataScope : FunctionScope
  return new constructor(keys, expressions, isRoot)
}

module.exports = (data = false) => {
  asData = data
  return linesParser
}
