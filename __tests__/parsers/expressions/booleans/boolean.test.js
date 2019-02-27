const {
  toValue,
  parse
} = require("arcsecond")
const boolean = require("../../../../parsers/expressions/booleans/boolean")

test("false", () => {
  const expression = toValue(parse(boolean)("false"))
  expect(expression.expression).toBe("false")
  expect(expression.type).toBe("Boolean")
  expect(expression.evaluate().value).toBe(false)
})

test("true", () => {
  const expression = toValue(parse(boolean)("true"))
  expect(expression.expression).toBe("true")
  expect(expression.type).toBe("Boolean")
  expect(expression.evaluate().value).toBe(true)
})
