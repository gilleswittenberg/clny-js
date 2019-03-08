const FunctionScope = require("../../../tree/expressions/FunctionScope")
const Number = require("../../../tree/expressions/scalars/Number")
const Assignment = require("../../../tree/expressions/Assignment")
const Identity = require("../../../tree/expressions/Identity")
const Statement = require("../../../tree/expressions/Statement")

describe("function scope", () => {

  test("return statement", () => {
    const expression = new Number(8)
    const statement = new Statement("return", expression)
    const scope = new FunctionScope(null, statement)
    expect(scope.evaluate()).toEqual(8)
  })

  test("last statement", () => {
    const expression = new Number(9)
    const expression1 = new Number(10)
    const scope = new FunctionScope(null, [expression, expression1])
    expect(scope.evaluate()).toEqual(10)
  })

  test("assignment", () => {
    const assignment = new Assignment("a", new Number(11))
    const identity = new Identity("a")
    const scope = new FunctionScope(null, [assignment, identity])
    expect(scope.evaluate()).toEqual(11)
  })

  test("scope identity", () => {
    const scope = new FunctionScope("scope", new Number(12))
    const identity = new Identity("scope")
    const scopeOuter = new FunctionScope(null, [scope, identity])
    expect(scopeOuter.evaluate()).toEqual(12)
  })
})
