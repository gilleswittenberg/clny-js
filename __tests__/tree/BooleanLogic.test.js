const Boolean = require("../../tree/expressions/scalars/Boolean")
const BooleanLogic = require("../../tree/expressions/operations/BooleanLogic")

test("not", () => {
  const expression = new Boolean(false)
  const logicValue = new BooleanLogic("!", expression).evaluate().value
  expect(logicValue).toBe(true)
})

test("and true", () => {
  const expression = new Boolean(true)
  const expression1 = new Boolean(true)
  const logicValue = new BooleanLogic("&", expression, expression1).evaluate().value
  expect(logicValue).toBe(true)
})

test("and false", () => {
  const expression = new Boolean(false)
  const expression1 = new Boolean(false)
  const logicValue = new BooleanLogic("&", expression, expression1).evaluate().value
  expect(logicValue).toBe(false)
})

test("or", () => {
  const expression = new Boolean(true)
  const expression1 = new Boolean(false)
  const logicValue = new BooleanLogic("|", expression, expression1).evaluate().value
  expect(logicValue).toBe(true)
})
