const {
  toValue,
  parse
} = require("arcsecond")
const expressions = require("../../../parsers/expressions/expressions")

test("single", () => {
  expect(toValue(parse(expressions)("5")).length).toBe(1)
})

test("list", () => {
  expect(toValue(parse(expressions)("6, 7, 8")).length).toBe(3)
})

test("list parens", () => {
  expect(toValue(parse(expressions)("(7, 8, 9, 10 )")).length).toBe(4)
})
