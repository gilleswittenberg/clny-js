const {
  toValue,
  parse
} = require("arcsecond")
const scope = require("../../../parsers/scope/statement")

test("return", () => {
  const content = "return 3"
  const value = toValue(parse(scope)(content))
  expect(value.name).toBe("return")
  expect(value.evaluate().length).toBe(1)
  expect(value.evaluate()[0].value).toBe(3)
})
