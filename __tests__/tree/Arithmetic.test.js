const Expression = require("../../tree/Expression")
const Arithmetic = require("../../tree/Arithmetic")

test("Arithmetic", () => {
  const expression = new Expression(5, "Number")
  const arithmeticValue = new Arithmetic(null, expression).evaluate().value
  expect(arithmeticValue).toBe(5)
})

test("negate", () => {
  const expression = new Expression(6, "Number")
  const arithmeticValue = new Arithmetic("-", expression).evaluate().value
  expect(arithmeticValue).toBe(-6)
})

test("subtraction", () => {
  const expression = new Expression(7, "Number")
  const expression1 = new Expression(3, "Number")
  const arithmeticValue = new Arithmetic("-", expression, expression1).evaluate().value
  expect(arithmeticValue).toBe(4)
})
