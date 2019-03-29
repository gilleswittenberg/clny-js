const Statement = require("../../../../tree/expressions/statements/Statement")
const Number = require("../../../../tree/expressions/scalars/Number")
const String = require("../../../../tree/expressions/scalars/String")

describe("return", () => {

  test("single", () => {
    const expression = new Number(5)
    const statement = new Statement("return", expression)
    expect(statement.evaluate()).toEqual(5)
  })

  test("plural", () => {
    const expression = new Number(6)
    const expression1 = new Number(7)
    const statement = new Statement("return", [expression, expression1])
    expect(statement.evaluate()).toEqual([6, 7])
  })
})

describe("output", () => {

  test("print", () => {
    const expression = new String("Hello World")
    const statement = new Statement("print", expression)
    expect(statement.name).toBe("print")
    expect(statement.evaluate()).toBe("Hello World")
  })

  test("log", () => {
    const statement = new Statement("log", new Number(0))
    expect(statement.name).toBe("log")
  })
})
