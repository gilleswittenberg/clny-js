const {
  pipeParsers,
  sequenceOf,
  many1,
  choice,
  mapTo,

  // tests
  parse,
  toValue
} = require("arcsecond")
const assert = require("assert").strict

const {
  colon
} = require("../convenience/tokens")

const {
  whitespaced
} = require("../convenience/whitespace")

const {
  wrappedInParentheses
} = require("../convenience/convenience")

const key = require("./key")
const expression = require("../expressions/expression")
const expressions = require("../expressions/expressions")

const Assignment = require("../../tree/Assignment")

const assignment = wrappedInParentheses(
  pipeParsers([
    sequenceOf([
      many1(
        pipeParsers([
          sequenceOf([
            key,
            whitespaced(colon),
          ]),
          mapTo(([key]) => key)
        ])
      ),
      expressions
    ]),
    mapTo(([keys, expressions]) => new Assignment(keys, expressions))
  ])
)


module.exports = assignment

const kv = toValue(parse(assignment)("k:51"))
assert.equal(kv.keys[0], "k")
assert.equal(kv.expressions[0].value.value, 51)

const kvParens = toValue(parse(assignment)("(p:59)"))
assert.equal(kvParens.keys[0], "p")
assert.equal(kvParens.expressions[0].value.value, 59)


const kvFloat = toValue(parse(assignment)("k:56.67"))
assert.equal(kvFloat.expressions[0].value.value, 56.67)

const kvString = toValue(parse(assignment)("k:\"a\""))
assert.equal(kvString.expressions[0].value.value, "a")

const kvSpacedRight = toValue(parse(assignment)("kk: 7"))
assert.equal(kvSpacedRight.keys[0], "kk")
assert.equal(kvSpacedRight.expressions[0].value.value, 7)

const kvSpacedLeft = toValue(parse(assignment)("kk :8"))
assert.equal(kvSpacedLeft.keys[0], "kk")
assert.equal(kvSpacedLeft.expressions[0].value.value, 8)

const kvSpacedLeftRight = toValue(parse(assignment)("k :  9"))
assert.equal(kvSpacedLeftRight.keys[0], "k")
assert.equal(kvSpacedLeftRight.expressions[0].value.value, 9)

const kvSpacedEnd = toValue(parse(assignment)("k:9  "))
assert.equal(kvSpacedEnd.keys[0], "k")
assert.equal(kvSpacedEnd.expressions[0].value.value, 9)

const kvExpressions = toValue(parse(assignment)("k: 2, 3"))
assert.equal(kvExpressions.expressions.length, 2)
assert.equal(kvExpressions.expressions[0].value.value, 2)
assert.equal(kvExpressions.expressions[1].value.value, 3)

// recursive assignment / expression / aliassing
const kvAlias = toValue(parse(assignment)("k: alias: 6"))
assert.equal(kvAlias.keys.length, 2)
assert.equal(kvAlias.keys[0], "k")
assert.equal(kvAlias.keys[1], "alias")
assert.equal(kvAlias.expressions.length, 1)
assert.equal(kvAlias.expressions[0].value.value, 6)
assert.equal(kvAlias.expressions[0].value.type, "Number")
assert.equal(kvAlias.kinds[0], "Impure")
