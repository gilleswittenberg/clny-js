const Number = require("../../tree/expressions/scalars/Number")
const Arithmetic = require("../../tree/expressions/operations/Arithmetic")

test("Arithmetic", () => {
  const expression = new Number(5)
  const arithmeticValue = new Arithmetic(null, expression).evaluate().value
  expect(arithmeticValue).toBe(5)
})

test("negate", () => {
  const expression = new Number(6)
  const arithmeticValue = new Arithmetic("-", expression).evaluate().value
  expect(arithmeticValue).toBe(-6)
})

test("subtraction", () => {
  const expression = new Number(7)
  const expression1 = new Number(3)
  const arithmeticValue = new Arithmetic("-", expression, expression1).evaluate().value
  expect(arithmeticValue).toBe(4)
})
