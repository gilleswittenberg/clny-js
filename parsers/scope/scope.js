const {
  letters,
  many1,
  pipeParsers,
  sequenceOf,
  many,
  possibly,
  mapTo,
  lookAhead,
  choice,
  recursiveParser,
  str,
  sepBy1,

  // tests
  parse,
  toValue
} = require("arcsecond")
const assert = require("assert").strict
const util = require('util')

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
    mapTo((expressions) => expressions.flat())
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
          scopeContent(depth)
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

// tests

const scopeExpression = "3"
const scopeExpressionValue = toValue(parse(scope)(scopeExpression))
assert.equal(scopeExpressionValue[0].value.value, 3)
assert.equal(scopeExpressionValue[0].value.type, "Number")

const scopeAssignment = "k: 4"
const scopeAssignmentValue = toValue(parse(scope)(scopeAssignment))
assert.equal(scopeAssignmentValue[0].keys[0], "k")
assert.equal(scopeAssignmentValue[0].expressions[0].value.value, 4)

const scopeSemicolons = "m: 8; n:9"
const scopeSemicolonsValue = toValue(parse(scope)(scopeSemicolons))
assert.equal(scopeSemicolonsValue.length, 2)

const scopeArray = "arr: 5, 6"
const scopeArrayValue = toValue(parse(scope)(scopeArray))
assert.equal(scopeArrayValue[0].keys[0], "arr")
assert.equal(scopeArrayValue[0].expressions[0].value.value, 5)
assert.equal(scopeArrayValue[0].expressions[1].value.value, 6)

const scopeArrayMultiline = `array:
  7
  8
`
const scopeArrayMultilineValue = toValue(parse(scope)(scopeArrayMultiline))
assert.equal(scopeArrayMultilineValue[0].keys[0], "array")
assert.equal(scopeArrayMultilineValue[0].expressions[0].value.value, 7)
assert.equal(scopeArrayMultilineValue[0].expressions[1].value.value, 8)

const scopeArrayMultilineDashedIndents = `arrayMD:
- 9
- 10
`
const scopeArrayMultilineDashedIndentsValue = toValue(parse(scope)(scopeArrayMultilineDashedIndents))
assert.equal(scopeArrayMultilineDashedIndentsValue[0].keys[0], "arrayMD")
assert.equal(scopeArrayMultilineDashedIndentsValue[0].expressions[0].value.value, 9)
assert.equal(scopeArrayMultilineDashedIndentsValue[0].expressions[1].value.value, 10)

const scopeArrayNamed = "array: k: 7, l: 8"
const scopeArrayNamedValue = toValue(parse(scope)(scopeArrayNamed))
assert.equal(scopeArrayNamedValue[0].keys[0], "array")
assert.equal(scopeArrayNamedValue[0].expressions[0].value.value, 7)
assert.equal(scopeArrayNamedValue[1].expressions[0].value.value, 8)

const scopeIndented = `scope
  k: 5
  l: 6
key: 9
`
const scopeIndentedValue = toValue(parse(scope)(scopeIndented))
assert.equal(scopeIndentedValue[0].keys[0], "scope")
assert.equal(scopeIndentedValue[0].expressions.length, 2)
assert.equal(scopeIndentedValue.length, 2)

const scopeDepth2 = `scope:
  deep:
    k: 5
    l: 6
`
const scopeDepth2Value = toValue(parse(scope)(scopeDepth2))
assert.equal(scopeDepth2Value[0].keys[0], "scope")
assert.equal(scopeDepth2Value[0].expressions[0].keys[0], "deep")
assert.equal(scopeDepth2Value[0].expressions[0].expressions.length, 2)

const scopeDepth22 = `scope:
  deepone:
    k: 7
  deeptwo:
    l: 8
  deepthree:
    s:
      m: 9
`
const scopeDepth22Value = toValue(parse(scope)(scopeDepth22))
assert.equal(scopeDepth22Value[0].keys[0], "scope")
assert.equal(scopeDepth22Value[0].expressions[0].keys[0], "deepone")
assert.equal(scopeDepth22Value[0].expressions[1].keys[0], "deeptwo")
assert.equal(scopeDepth22Value[0].expressions[2].keys[0], "deepthree")
assert.equal(scopeDepth22Value[0].expressions[2].expressions[0].keys[0], "s")
assert.equal(scopeDepth22Value[0].expressions[2].expressions[0].expressions[0].expressions[0].value.value, 9)

const scopeDepthRoot2 = `scope:
  k: 7
two:
  l: 8
`
const scopeDepthRoot2Value = toValue(parse(scope)(scopeDepthRoot2))
assert.equal(scopeDepthRoot2Value[0].keys[0], "scope")
assert.equal(scopeDepthRoot2Value[1].keys[0], "two")

const scopeSemicolons2 = `scope:
  m: 8; n:9
`
const scopeSemicolons2Value = toValue(parse(scope)(scopeSemicolons2))
assert.equal(scopeSemicolons2Value[0].expressions.length, 2)

const scopeDepthDashedIndents = `scope:
- deepone:
  - k: 7
- deeptwo:
  - l: 8
- deepthree:
  - s:
    - m: 9
`
const scopeDepthDashedIndentsValue = toValue(parse(scope)(scopeDepthDashedIndents))
assert.equal(scopeDepthDashedIndentsValue[0].keys[0], "scope")
assert.equal(scopeDepthDashedIndentsValue[0].expressions[0].keys[0], "deepone")
assert.equal(scopeDepthDashedIndentsValue[0].expressions[1].keys[0], "deeptwo")
assert.equal(scopeDepthDashedIndentsValue[0].expressions[2].keys[0], "deepthree")
assert.equal(scopeDepthDashedIndentsValue[0].expressions[2].expressions[0].keys[0], "s")
assert.equal(scopeDepthDashedIndentsValue[0].expressions[2].expressions[0].expressions[0].expressions[0].value.value, 9)
