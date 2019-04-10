const {
  toValue,
  parse
} = require("arcsecond")
const root = require("../../parsers/root")
const rootScope = root()
const Scope = require("../../tree/expressions/scopes/Scope")
const Assignment = require("../../tree/expressions/Assignment")
const Operation = require("../../tree/expressions/operations/Operation")
const Application = require("../../tree/expressions/scopes/Application")
const Function = require("../../tree/expressions/scopes/Function")
const FunctionScope = require("../../tree/expressions/scopes/FunctionScope")

describe("root function", () => {

  test("single line", () => {
    const content = "f: n: Number, m: Number -> Number m + n"
    const result = toValue(parse(rootScope)(content))
    expect(result).toBeInstanceOf(Scope)
    expect(result.expressions.length).toBe(1)
    expect(result.expressions[0]).toBeInstanceOf(Assignment)
    expect(result.expressions[0].expressions.length).toBe(1)
    expect(result.expressions[0].expressions[0]).toBeInstanceOf(Application)
    expect(result.expressions[0].expressions[0].arguments[0]).toBeInstanceOf(Operation)
  })

  test("assignment", () => {
    const content = `concat: s: String, t: String -> String
  s + t
`
    const result = toValue(parse(rootScope)(content))
    expect(result).toBeInstanceOf(Scope)
    expect(result.expressions.length).toBe(1)
    expect(result.expressions[0]).toBeInstanceOf(Assignment)
    expect(result.expressions[0].keys[0].name).toBe("concat")
    expect(result.expressions[0].expressions.length).toBe(1)
    expect(result.expressions[0].expressions[0]).toBeInstanceOf(Function)
    expect(result.expressions[0].expressions[0].expressions[0]).toBeInstanceOf(FunctionScope)
    expect(result.expressions[0].expressions[0].expressions[0].expressions[0]).toBeInstanceOf(Operation)

  })
})
