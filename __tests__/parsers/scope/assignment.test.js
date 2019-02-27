const {
  toValue,
  parse
} = require("arcsecond")
const assignmentParser = require("../../../parsers/scope/assignment")

test("key, value", () => {
  const assignment = toValue(parse(assignmentParser)("k:51"))
  assignment.evaluate()
  expect(assignment.keys).toEqual(["k"])
  expect(assignment.expressions[0].value.value).toBe(51)
})

test("parens", () => {
  const assignment = toValue(parse(assignmentParser)("(p:59)"))
  assignment.evaluate()
  expect(assignment.keys).toEqual(["p"])
  expect(assignment.expressions[0].value.value).toBe(59)
})

test("spaced right", () => {
  const assignment = toValue(parse(assignmentParser)("kk: 7"))
  assignment.evaluate()
  expect(assignment.keys).toEqual(["kk"])
  expect(assignment.expressions[0].value.value).toBe(7)
})

test("spaced left", () => {
  const assignment = toValue(parse(assignmentParser)("kl :8"))
  assignment.evaluate()
  expect(assignment.keys).toEqual(["kl"])
  expect(assignment.expressions[0].value.value).toBe(8)
})

test("spaced left, right", () => {
  const assignment = toValue(parse(assignmentParser)("klr  :   9"))
  assignment.evaluate()
  expect(assignment.keys).toEqual(["klr"])
  expect(assignment.expressions[0].value.value).toBe(9)
})

test("spaced end", () => {
  const assignment = toValue(parse(assignmentParser)("ke:0   "))
  assignment.evaluate()
  expect(assignment.keys).toEqual(["ke"])
  expect(assignment.expressions[0].value.value).toBe(0)
})

test("expressions", () => {
  const assignment = toValue(parse(assignmentParser)("k: 2, 3"))
  assignment.evaluate()
  expect(assignment.expressions.length).toBe(2)
  expect(assignment.expressions[0].value.value).toBe(2)
  expect(assignment.expressions[1].value.value).toBe(3)
})

test("aliases", () => {
  const assignment = toValue(parse(assignmentParser)("k: alias: 6"))
  assignment.evaluate()
  expect(assignment.keys).toEqual(["k", "alias"])
  expect(assignment.expressions.length).toBe(1)
  expect(assignment.expressions[0].value.value).toBe(6)
  expect(assignment.expressions[0].value.type).toBe("Number")
})