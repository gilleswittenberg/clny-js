const Expression = require("../../../tree/expressions/Expression")


xtest("Number", () => {
  const expressionValue = new Expression(5).evaluate()
  expect(expressionValue).toBe(5)
  expect(expressionValue.type).toBe("Number")
})

xtest("Boolean as String", () => {
  const expressionValue = new Expression(true, "String").evaluate()
  expect(expressionValue).toBe("true")
  expect(expressionValue.type).toBe("String")
})

xtest("castTo", () => {
  const expression = new Expression(567)
  const expressionValue = expression.evaluate()
  expect(expressionValue).toBe(567)
  expect(expressionValue.type).toBe("Number")
  const castExpressionValue = expression.castTo("String").evaluate()
  expect(castExpressionValue).toBe("567")
  expect(castExpressionValue.type).toBe("String")
})
