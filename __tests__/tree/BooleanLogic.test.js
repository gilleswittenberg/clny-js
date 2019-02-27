const Expression = require("../../tree/Expression")
const BooleanLogic = require("../../tree/BooleanLogic")

test("not", () => {
  const expression = new Expression(false, "Boolean")
  const logicValue = new BooleanLogic("!", expression).evaluate().value
  expect(logicValue).toBe(true)
})

test("and true", () => {
  const expression = new Expression(true, "Boolean")
  const expression1 = new Expression(true, "Boolean")
  const logicValue = new BooleanLogic("&", expression, expression1).evaluate().value
  expect(logicValue).toBe(true)
})

test("and false", () => {
  const expression = new Expression(false, "Boolean")
  const expression1 = new Expression(false, "Boolean")
  const logicValue = new BooleanLogic("&", expression, expression1).evaluate().value
  expect(logicValue).toBe(false)
})

test("or", () => {
  const expression = new Expression(true, "Boolean")
  const expression1 = new Expression(false, "Boolean")
  const logicValue = new BooleanLogic("|", expression, expression1).evaluate().value
  expect(logicValue).toBe(true)
})
