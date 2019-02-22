const {
  toValue,
  parse
} = require("arcsecond")
const nullParser = require("../../../parsers/expressions/null")

test("null", () => {
  expect(toValue(parse(nullParser)("null"))).toBe(null)
})
