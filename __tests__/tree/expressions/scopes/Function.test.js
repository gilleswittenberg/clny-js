const Function = require("../../../../tree/expressions/scopes/Function")
const FunctionScope = require("../../../../tree/expressions/scopes/FunctionScope")
const Number = require("../../../../tree/expressions/scalars/Number")
const Identity = require("../../../../tree/expressions/Identity")
const Environment = require("../../../../tree/expressions/scopes/Environment")
const Type = require("../../../../tree/types/Type")

describe("Function", () => {

  test("apply", () => {
    const functionScope = new FunctionScope(null, new Number(13))
    const environment = new Environment()
    const func = new Function(null, functionScope, environment)
    expect(func.getProperty("apply")()).toBe(13)
  })

  test("apply environment", () => {
    const identity = new Identity("n")
    const functionScope = new FunctionScope(null, identity)
    const environment = new Environment()
    environment.set("n", new Number(14))
    const func = new Function(null, functionScope, environment)
    expect(func.getProperty("apply")()).toBe(14)
  })

  test("apply arguments", () => {
    const functionScope = new FunctionScope(null, new Identity("m"))
    const m = new Number(15)
    const environment = new Environment()
    const type = new Type(null, null, new Type("Number"), [new Type("Number", null, null, null, "m")])
    const func = new Function(type, functionScope, environment)
    expect(func.getProperty("apply")(m)).toBe(15)
  })
})
