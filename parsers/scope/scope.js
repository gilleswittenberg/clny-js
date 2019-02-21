const {
  many1,
  pipeParsers,
  sequenceOf,
  many,
  possibly,
  mapTo,
  choice,
  recursiveParser
} = require("arcsecond")

const settings = require("../../settings.json")

const {
  colon,
  semicolon
} = require("../convenience/tokens")

const {
  newline,
  whitespaced,
  indents,
  eol
} = require("../convenience/whitespace")

const key = require("./key")
const assignments = require("./assignments")
const expressions = require("../expressions/expressions")

const Assignment = require("../../tree/Assignment")

const indentedNewline = num => {
  if (num === 0) return newline
  const indention = indents(num)
  return sequenceOf([newline, indention])
}

const scopeOpener = indents => {
  return pipeParsers([
    sequenceOf([
      key,
      possibly(whitespaced(colon)),
      indentedNewline(indents)
    ]),
    mapTo(([key]) => key)
  ])
}

const scopeContent = indents => {
  const nl = indents > 0 ? indentedNewline(indents) : eol
  return pipeParsers([
    many1(
      pipeParsers([
        sequenceOf([
          many(nl),
          choice([
            assignments,
            expressions
          ]),
          possibly(whitespaced(semicolon))
        ]),
        mapTo(([,expressions]) => expressions)
      ])
    ),
    mapTo(expressions => expressions.flat())
  ])
}

const createScope = depth => {
  if (depth < maxScopeDepth) {
    return pipeParsers([
      many1(
        choice([
          pipeParsers([
            sequenceOf([
              scopeOpener(depth + 1),
              createScope(depth + 1),
              possibly(indentedNewline(depth))
            ]),
            mapTo(([key, scope]) => new Assignment([key], scope))
          ]),
          pipeParsers([
            sequenceOf([
              scopeContent(depth),
              possibly(indentedNewline(depth))
            ]),
            mapTo(([scope]) => scope)
          ])
        ])
      ),
      mapTo(objects => objects.flat())
    ])
  }
  return scopeContent(depth)
}

const maxScopeDepth = settings.maxScopeDepth
const scope = recursiveParser(() => createScope(0))

module.exports = scope
