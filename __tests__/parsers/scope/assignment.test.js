const {
  toValue,
  parse
} = require("arcsecond")
const assignment = require("../../../parsers/scope/assignment")

test("key, value", () => {
  const value = toValue(parse(assignment)("k:51"))
  expect(value.keys).toEqual(["k"])
  expect(value.expressions[0].value.value).toBe(51)
})

test("parens", () => {
  const value = toValue(parse(assignment)("(p:59)"))
  expect(value.keys).toEqual(["p"])
  expect(value.expressions[0].value.value).toBe(59)
})

test("spaced right", () => {
  const value = toValue(parse(assignment)("kk: 7"))
  expect(value.keys).toEqual(["kk"])
  expect(value.expressions[0].value.value).toBe(7)
})

test("spaced left", () => {
  const value = toValue(parse(assignment)("kl :8"))
  expect(value.keys).toEqual(["kl"])
  expect(value.expressions[0].value.value).toBe(8)
})

test("spaced left, right", () => {
  const value = toValue(parse(assignment)("klr  :   9"))
  expect(value.keys).toEqual(["klr"])
  expect(value.expressions[0].value.value).toBe(9)
})

test("spaced end", () => {
  const value = toValue(parse(assignment)("ke:0   "))
  expect(value.keys).toEqual(["ke"])
  expect(value.expressions[0].value.value).toBe(0)
})

test("expressions", () => {
  const value = toValue(parse(assignment)("k: 2, 3"))
  expect(value.expressions.length).toBe(2)
  expect(value.expressions[0].value.value).toBe(2)
  expect(value.expressions[1].value.value).toBe(3)
})

test("aliases", () => {
  const value = toValue(parse(assignment)("k: alias: 6"))
  expect(value.keys).toEqual(["k", "alias"])
  expect(value.expressions.length).toBe(1)
  expect(value.expressions[0].value.value).toBe(6)
  expect(value.expressions[0].value.type).toBe("Number")
  expect(value.kinds).toEqual(["Impure"])
})
