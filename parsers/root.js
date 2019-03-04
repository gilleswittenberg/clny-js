const {
  char,
  possibly,
  choice,
  many,
  sequenceOf,
  pipeParsers,
  mapTo
} = require("arcsecond")

const {
  indent,
  whitespaced
} = require("./convenience/whitespace")

const key = require("./scope/key")
const expressions = require("./expressions/expressions")
const eol = char("\n")

const Indent = require("../tree/Indent")
const ScopeOpener = require("../tree/ScopeOpener")
const Scope = require("../tree/expressions/Scope")
const RootScope = require("../tree/expressions/RootScope")
const Line = require("../tree/Line")

const indents = pipeParsers([
  many(indent),
  mapTo(indents => new Indent(indents.length))
])

const scopeOpener = pipeParsers([
  sequenceOf([
    key,
    whitespaced(char(":"))
  ]),
  mapTo(([key]) => new ScopeOpener(key))
])

const lineContent = choice([
  expressions,
  scopeOpener
])

const line = pipeParsers([
  sequenceOf([
    indents,
    lineContent,
    possibly(eol)
  ]),
  mapTo(([indent, content]) => [content, indent])
])

const mapLinesToScopes = lines => {

  const rootScope = new RootScope()
  const scopes = [rootScope]
  const currentScope = () => scopes[scopes.length - 1]
  const currentIndents = () => scopes.length - 1
  lines.forEach(line => {

    const indents = line.indents
    if (indents > currentIndents()) throw "Invalid indention"

    const content = line.chars

    // new scope
    if (content instanceof ScopeOpener) {
      const newScope = new Scope(content.key)
      scopes.push(newScope)
      return
    }

    // close scope
    if (indents === currentIndents() - 1) {
      const scope = scopes.pop()
      currentScope().expressions.push(scope)
    }

    // current scope
    if (indents === currentIndents()) {
      currentScope().expressions.push(content)
    }
  })

  return scopes[0]
}

const linesParser = pipeParsers([
  many(line),
  mapTo(lines => {
    return mapLinesToScopes(lines.map((line, index) => new Line(line[0], index, line[1].level)))
  })
])

module.exports = linesParser
