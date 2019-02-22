const Expression = require("../../tree/Expression")

test("Number", () => {
  const expressionValue = new Expression(5).evaluate()
  expect(expressionValue.value).toBe(5)
  expect(expressionValue.type).toBe("Number")
})

test("Boolean as String", () => {
  const expressionValue = new Expression(true, "String").evaluate()
  expect(expressionValue.value).toBe("true")
  expect(expressionValue.type).toBe("String")
})

test("castTo", () => {
  const expression = new Expression(567)
  const expressionValue = expression.evaluate()
  expect(expressionValue.value).toBe(567)
  expect(expressionValue.type).toBe("Number")
  const castExpressionValue = expression.castTo("String").evaluate()
  expect(castExpressionValue.value).toBe("567")
  expect(castExpressionValue.type).toBe("String")
})
