const BooleanLogic = require("../../tree/expressions/operations/BooleanLogic")

test("not", () => {
  const logicValue = new BooleanLogic("!", false).evaluate()
  expect(logicValue).toBe(true)
})

test("and true", () => {
  const logicValue = new BooleanLogic("&", true, true).evaluate()
  expect(logicValue).toBe(true)
})

test("and false", () => {
  const logicValue = new BooleanLogic("&", false, false).evaluate()
  expect(logicValue).toBe(false)
})

test("or", () => {
  const logicValue = new BooleanLogic("|", true, false).evaluate()
  expect(logicValue).toBe(true)
})
