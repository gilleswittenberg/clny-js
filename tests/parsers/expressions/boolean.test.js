const {
  toValue,
  parse
} = require("arcsecond")
const boolean = require("../../../parsers/expressions/boolean")

test("false", () => {
  expect(toValue(parse(boolean)("false"))).toBe(false)
})

test("true", () => {
  expect(toValue(parse(boolean)("true"))).toBe(true)
})
