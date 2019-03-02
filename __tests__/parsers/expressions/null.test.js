const {
  toValue,
  parse
} = require("arcsecond")
const nullParser = require("../../../parsers/expressions/null")

test("null", () => {
  const expression = toValue(parse(nullParser)("null"))
  expect(expression.literal).toBe("null")
  expect(expression.type).toBe("Null")
  expect(expression.value).toBe(null)
})
