const Expression = require("../../tree/Expression")
const Statement = require("../../tree/Statement")

test("single", () => {
  const expression = new Expression(5, "Number")
  const statement = new Statement("return", [expression])
  expect(statement.evaluate()).toEqual([5])
})
