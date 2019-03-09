const FunctionScope = require("../../../tree/expressions/FunctionScope")
const Number = require("../../../tree/expressions/scalars/Number")
const Boolean = require("../../../tree/expressions/scalars/Boolean")
const Assignment = require("../../../tree/expressions/Assignment")
const Identity = require("../../../tree/expressions/Identity")
const Statement = require("../../../tree/expressions/Statement")
const ConditionalStatement = require("../../../tree/expressions/ConditionalStatement")

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

describe("conditional statements", () => {

  test("do not evaluate if consequent", () => {
    const condition = new Boolean(false)
    const consequent = new FunctionScope()
    const spy = jest.spyOn(consequent, "evaluate")
    const ifStatement = new ConditionalStatement("if", [condition, consequent])
    const scope = new FunctionScope(null, ifStatement)
    scope.evaluate()
    expect(spy).not.toHaveBeenCalled()
  })

  test("require preceding if consequent for elseif", () => {
    const condition = new Boolean(false)
    const consequent = new FunctionScope()
    const elseIfStatement = new ConditionalStatement("elseif", [condition, consequent])
    const scope = new FunctionScope(null, elseIfStatement)
    expect(() => scope.evaluate()).toThrow("ConditionalStatement elseif should be preceded by if Statement")
  })

  test("if, elseif", () => {
    const ifCondition = new Boolean(true)
    const ifConsequent = new FunctionScope(null, new Number(13))
    const ifStatement = new ConditionalStatement("if", [ifCondition, ifConsequent])
    const elseifCondition = new Boolean(false)
    const elseifConsequent = new FunctionScope(null)
    const elseifStatement = new ConditionalStatement("else", [elseifCondition, elseifConsequent])
    const scope = new FunctionScope(null, [ifStatement, elseifStatement])
    const spyIf = jest.spyOn(ifConsequent, "evaluate")
    const spyElseif = jest.spyOn(elseifConsequent, "evaluate")
    scope.evaluate()
    expect(spyIf).toHaveBeenCalled()
    expect(spyElseif).not.toHaveBeenCalled()
    expect(scope.value).toBe(13)
  })

  test("if, else", () => {
    const condition = new Boolean(false)
    const ifConsequent = new FunctionScope()
    const ifStatement = new ConditionalStatement("if", [condition, ifConsequent])
    const elseConsequent = new FunctionScope(null, new Number(14))
    const elseStatement = new ConditionalStatement("else", elseConsequent)
    const scope = new FunctionScope(null, [ifStatement, elseStatement])
    const spyIf = jest.spyOn(ifConsequent, "evaluate")
    const spyElse = jest.spyOn(elseConsequent, "evaluate")
    scope.evaluate()
    expect(spyIf).not.toHaveBeenCalled()
    expect(spyElse).toHaveBeenCalled()
  })
})
