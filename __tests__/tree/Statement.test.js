const Number = require("../../tree/expressions/scalars/Number")
const Statement = require("../../tree/Statement")

test("single", () => {
  const expression = new Number(5)
  const statement = new Statement("return", [expression])
  expect(statement.evaluate().map(number => number.value)).toEqual([5])
})
