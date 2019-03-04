const {
  toValue,
  parse
} = require("arcsecond")
const root = require("../../parsers/root")
const RootScope = require("../../tree/expressions/RootScope")
const Scope = require("../../tree/expressions/Scope")
const Assignment = require("../../tree/expressions/Assignment")
const Number = require("../../tree/expressions/scalars/Number")

test("root scope", () => {
  const content = "key: 5"
  const result = toValue(parse(root)(content))
  expect(result).toBeInstanceOf(RootScope)
  expect(result.expressions.length).toBe(1)
  expect(result.expressions[0]).toBeInstanceOf(Assignment)
  expect(result.expressions[0].keys).toEqual(["key"])
  expect(result.expressions[0].expressions[0]).toBeInstanceOf(Number)
})


test("deep", () => {
  const content = `scope:
  k:
    a: 9
  l: 6
my: 9
`
  const result = toValue(parse(root)(content))
  expect(result.expressions.length).toBe(2)
  expect(result.expressions[0]).toBeInstanceOf(Scope)
  expect(result.expressions[0].keys).toEqual(["scope"])
  expect(result.expressions[0].expressions[0]).toBeInstanceOf(Scope)
  expect(result.expressions[0].expressions[0].keys).toEqual(["k"])
  expect(result.expressions[1]).toBeInstanceOf(Assignment)
})
