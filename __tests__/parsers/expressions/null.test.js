const {
  toValue,
  parse
} = require("arcsecond")
const nullParser = require("../../../parsers/expressions/null")

test("null", () => {
  const expression = toValue(parse(nullParser)("null"))
  expect(expression.expression).toBe("null")
  expect(expression.type).toBe("Null")
  expect(expression.evaluate().value).toBe(null)
})
