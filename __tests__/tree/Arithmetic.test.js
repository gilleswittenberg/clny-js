const Arithmetic = require("../../tree/expressions/operations/Arithmetic")

test("Arithmetic", () => {
  const arithmeticValue = new Arithmetic(null, 5).evaluate()
  expect(arithmeticValue).toBe(5)
})

test("negate", () => {
  const arithmeticValue = new Arithmetic("-", 6).evaluate()
  expect(arithmeticValue).toBe(-6)
})

test("subtraction", () => {
  const arithmeticValue = new Arithmetic("-", 7, 3).evaluate()
  expect(arithmeticValue).toBe(4)
})
