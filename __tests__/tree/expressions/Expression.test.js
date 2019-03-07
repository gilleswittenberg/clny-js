const Expression = require("../../../tree/expressions/Expression")
const Number = require("../../../tree/expressions/scalars/Number")

describe("Expression", () => {

  test("constructor", () => {
    const expression = new Expression("Number", new Number(4))
    expect(expression.isEvaluated).toBe(false)
    expect(expression.isEmpty).toBe(false)
    expect(expression.isSingle).toBe(true)
    expect(expression.isPlural).toBe(false)
    expect(expression.expressions.length).toBe(1)
    expect(expression.expressions[0]).toBeInstanceOf(Number)
  })

  test("evaluation", () => {
    const expression = new Expression("Number", new Number(5))
    expression.evaluate()
    expect(expression.type).toBe("Number")
    expect(expression.value).toBe(5)
  })
})
