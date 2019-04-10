const {
  toValue,
  parse
} = require("arcsecond")
const root = require("../../parsers/root")
const rootScope = root(true)
const Scope = require("../../tree/expressions/scopes/Scope")
const Assignment = require("../../tree/expressions/Assignment")
const Number = require("../../tree/expressions/scalars/Number")
const Application = require("../../tree/expressions/scopes/Application")

describe("root assignment", () => {

  test("scalar", () => {
    const content = "key: 5"
    const result = toValue(parse(rootScope)(content))
    expect(result).toBeInstanceOf(Scope)
    expect(result.expressions.length).toBe(1)
    expect(result.expressions[0]).toBeInstanceOf(Assignment)
    expect(result.expressions[0].keys[0].name).toBe("key")
    expect(result.expressions[0].expressions[0]).toBeInstanceOf(Number)
  })

  test("plural", () => {
    const content = "array: 6, 7"
    const result = toValue(parse(rootScope)(content))
    expect(result).toBeInstanceOf(Scope)
    expect(result.expressions.length).toBe(1)
    expect(result.expressions[0]).toBeInstanceOf(Assignment)
    expect(result.expressions[0].keys[0].name).toBe("array")
    expect(result.expressions[0].expressions[0].isPlural).toBe(true)
    expect(result.expressions[0].expressions[0].expressions[0]).toBeInstanceOf(Number)
    expect(result.expressions[0].expressions[0].expressions[1]).toBeInstanceOf(Number)
  })

  test("typed", () => {
    const content = "b: Boolean true"
    const result = toValue(parse(rootScope)(content))
    expect(result.expressions.length).toBe(1)
    expect(result.expressions[0]).toBeInstanceOf(Assignment)
    expect(result.expressions[0].keys[0].name).toBe("b")
    expect(result.expressions[0].expressions[0]).toBeInstanceOf(Application)
  })
})
