const {
  toValue,
  parse
} = require("arcsecond")
const boolean = require("../../../../parsers/expressions/booleans/boolean")

test("false", () => {
  const expression = toValue(parse(boolean)("false"))
  expect(expression.literal).toBe("false")
  expect(expression.type).toBe("Boolean")
  expect(expression.value).toBe(false)
})

test("true", () => {
  const expression = toValue(parse(boolean)("true"))
  expect(expression.literal).toBe("true")
  expect(expression.type).toBe("Boolean")
  expect(expression.value).toBe(true)
})
