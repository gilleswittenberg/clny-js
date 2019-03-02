const {
  toValue,
  parse
} = require("arcsecond")
const Number = require("../../../tree/expressions/scalars/Number")
const assignmentParser = require("../../../parsers/scope/assignment")

xtest("key, value", () => {
  const assignment = toValue(parse(assignmentParser)("k:51"))
  assignment.evaluate()
  expect(assignment.keys).toEqual(["k"])
  expect(assignment.expressions[0].value).toBe(51)
})

xtest("parens", () => {
  const assignment = toValue(parse(assignmentParser)("(p:59)"))
  assignment.evaluate()
  expect(assignment.keys).toEqual(["p"])
  expect(assignment.expressions[0].value).toBe(59)
})

xtest("spaced right", () => {
  const assignment = toValue(parse(assignmentParser)("kk: 7"))
  assignment.evaluate()
  expect(assignment.keys).toEqual(["kk"])
  expect(assignment.expressions[0].value).toBe(7)
})

xtest("spaced left", () => {
  const assignment = toValue(parse(assignmentParser)("kl :8"))
  assignment.evaluate()
  expect(assignment.keys).toEqual(["kl"])
  expect(assignment.expressions[0].value).toBe(8)
})

xtest("spaced left, right", () => {
  const assignment = toValue(parse(assignmentParser)("klr  :   9"))
  assignment.evaluate()
  expect(assignment.keys).toEqual(["klr"])
  expect(assignment.expressions[0].value).toBe(9)
})

xtest("spaced end", () => {
  const assignment = toValue(parse(assignmentParser)("ke:0   "))
  assignment.evaluate()
  expect(assignment.keys).toEqual(["ke"])
  expect(assignment.expressions[0].value).toBe(0)
})

xtest("expressions", () => {
  const assignment = toValue(parse(assignmentParser)("k: 2, 3"))
  assignment.evaluate()
  expect(assignment.expressions.length).toBe(2)
  expect(assignment.expressions[0].value).toBe(2)
  expect(assignment.expressions[1].value).toBe(3)
})

xtest("aliases", () => {
  const assignment = toValue(parse(assignmentParser)("k: alias: 6"))
  assignment.evaluate()
  expect(assignment.keys).toEqual(["k", "alias"])
  expect(assignment.expressions.length).toBe(1)
  expect(assignment.expressions[0].value).toBe(6)
  expect(assignment.expressions[0]).toBeInstanceOf(Number)
})
