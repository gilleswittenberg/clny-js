const Number = require("../../tree/expressions/scalars/Number")
const Statement = require("../../tree/expressions/Statement")

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
