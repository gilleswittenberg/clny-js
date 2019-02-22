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

test("castTo", () => {
  const expression = new Expression(567)
  expect(expression.value.value).toBe(567)
  expect(expression.value.type).toBe("Number")
  const castExpression = expression.castTo("String")
  expect(castExpression.value.value).toBe("567")
  expect(castExpression.value.type).toBe("String")
})
