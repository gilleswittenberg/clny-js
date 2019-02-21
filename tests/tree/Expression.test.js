const Expression = require("../../tree/Expression")

test("Number", () => {
  const expression = new Expression(5)
  expect(expression.value.value).toBe(5)
  expect(expression.value.type).toBe("Number")
})

test("Boolean as String", () => {
  const expression = new Expression(true, "String")
  expect(expression.value.value).toBe("true")
  expect(expression.value.type).toBe("String")
})
