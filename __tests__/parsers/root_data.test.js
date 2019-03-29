const {
  toValue,
  parse
} = require("arcsecond")
const root = require("../../parsers/root")
const rootScope = root(true)
const Scope = require("../../tree/expressions/scopes/Scope")
const Assignment = require("../../tree/expressions/Assignment")
const String = require("../../tree/expressions/scalars/String")

describe("root data", () => {

  test("assignments", () => {
    const content = `scope:
  k:
    a: 9
  l: 6
my: 9
`
    const result = toValue(parse(rootScope)(content))
    expect(result.expressions.length).toBe(2)
    expect(result.expressions[0]).toBeInstanceOf(Scope)
    expect(result.expressions[0].keys).toEqual(["scope"])
    expect(result.expressions[0].expressions[0]).toBeInstanceOf(Scope)
    expect(result.expressions[0].expressions[0].keys).toEqual(["k"])
    expect(result.expressions[1]).toBeInstanceOf(Assignment)
  })

  test("array", () => {
    const content = `arr:
  "a"
  "b"
`
    const result = toValue(parse(rootScope)(content))
    expect(result.expressions.length).toBe(1)
    expect(result.expressions[0]).toBeInstanceOf(Scope)
    expect(result.expressions[0].keys).toEqual(["arr"])
    expect(result.expressions[0].expressions[0]).toBeInstanceOf(String)
    expect(result.expressions[0].expressions[1]).toBeInstanceOf(String)
  })

  test("empty scope opener", () => {
    const content = `scope:
"a"
`
    expect(() => parse(rootScope)(content)).toThrow("Scope opened without adding expressions")
  })
})
