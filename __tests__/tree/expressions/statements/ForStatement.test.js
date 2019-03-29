const ForStatement = require("../../../../tree/expressions/statements/ForStatement")
const Expression = require("../../../../tree/expressions/Expression")
const Number = require("../../../../tree/expressions/scalars/Number")
const Operation = require("../../../../tree/expressions/operations/Operation")
const Scope = require("../../../../tree/expressions/scopes/Scope")

describe("for statement", () => {

  test("number", () => {
    const number = new Number(5)
    const scope = new Scope()
    const statement = new ForStatement("for", [number, scope])
    expect(statement.name).toBe("for")
    expect(statement.evaluate().length).toBe(5)
  })

  test("plural", () => {
    const number = new Number(3)
    const number1 = new Number(2)
    const plural = new Expression(null, [number, number1])
    const scope = new Scope()
    const statement = new ForStatement("for", [plural, scope])
    expect(statement.name).toBe("for")
    expect(statement.evaluate().length).toBe(2)
  })

  test("range", () => {
    const number = new Number(1)
    const number1 = new Number(4)
    const range = new Operation("INFIX", ",,", number, number1)
    const scope = new Scope()
    const statement = new ForStatement("for", [range, scope])
    expect(statement.name).toBe("for")
    expect(statement.evaluate().length).toBe(4)
  })
})
