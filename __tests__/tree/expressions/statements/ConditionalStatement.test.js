const ConditionalStatement = require("../../../../tree/expressions/statements/ConditionalStatement")
const Number = require("../../../../tree/expressions/scalars/Number")
const Boolean = require("../../../../tree/expressions/scalars/Boolean")
const Scope = require("../../../../tree/expressions/Scope")

describe("if", () => {

  test("false", () => {
    const expression = new Boolean(false)
    const scope = new Scope()
    const statement = new ConditionalStatement("if", [expression, scope])
    expect(statement.name).toBe("if")
    expect(statement.evaluate()).toEqual([false, null])
  })

  test("true", () => {
    const expression = new Boolean(true)
    const scope = new Scope(null, new Number(3))
    const statement = new ConditionalStatement("if", [expression, scope])
    expect(statement.name).toBe("if")
    expect(statement.evaluate()).toEqual([true, 3])
  })
})

describe("elseif", () => {

  test("false", () => {
    const expression = new Boolean(false)
    const scope = new Scope()
    const statement = new ConditionalStatement("elseif", [expression, scope])
    expect(statement.name).toBe("elseif")
    expect(statement.evaluate()).toEqual([false, null])
  })

  test("true", () => {
    const expression = new Boolean(true)
    const scope = new Scope(null, new Number(4))
    const statement = new ConditionalStatement("elseif", [expression, scope])
    expect(statement.name).toBe("elseif")
    expect(statement.evaluate()).toEqual([true, 4])
  })
})

describe("else", () => {

  test("else", () => {
    const scope = new Scope(null, new Number(5))
    const statement = new ConditionalStatement("else", [scope])
    expect(statement.name).toBe("else")
    expect(statement.evaluate()).toEqual(5)
  })
})


describe("conditionals", () => {

  test("if elseif", () => {
    const expression = new Boolean(true)
    const scope = new Scope(null, new Number(4))
    const ifStatement = new ConditionalStatement("if", [expression, scope])
    ifStatement.evaluate()
    const expression1 = new Boolean(true)
    const scope1 = new Scope(null, new Number(5))
    const elseIfStatement = new ConditionalStatement("elseif", [expression1, scope1])
    expect(elseIfStatement.doNotEvaluate(ifStatement.value[1])).toEqual([true, 4])
  })
})
