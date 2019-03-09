const ConditionalStatement = require("../../../tree/expressions/ConditionalStatement")
const Number = require("../../../tree/expressions/scalars/Number")
const Boolean = require("../../../tree/expressions/scalars/Boolean")
const Scope = require("../../../tree/expressions/Scope")

describe("if", () => {

  test("if false", () => {
    const expression = new Boolean(false)
    const scope = new Scope()
    const statement = new ConditionalStatement("if", [expression, scope])
    expect(statement.name).toBe("if")
    expect(statement.evaluate()).toEqual([false, null])
  })

  test("if true", () => {
    const expression = new Boolean(true)
    const scope = new Scope(null, new Number(3))
    const statement = new ConditionalStatement("if", [expression, scope])
    expect(statement.name).toBe("if")
    expect(statement.evaluate()).toEqual([true, 3])
  })
})
