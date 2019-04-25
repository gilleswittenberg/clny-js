const {
  toValue,
  parse
} = require("arcsecond")
const parser = require("../../../parsers/expressions/expressions")
const Application = require("../../../tree/expressions/scopes/Application")
const Identity = require("../../../tree/expressions/Identity")
const Number = require("../../../tree/expressions/scalars/Number")

test("statement", () => {
  const value = toValue(parse(parser)("return 5"))
  expect(value).toBeInstanceOf(Application)
  expect(value.expressions[0]).toBeInstanceOf(Identity)
  expect(value.expressions[0].key.name).toBe("return")
  expect(value.arguments.length).toBe(1)
  expect(value.arguments[0]).toBeInstanceOf(Number)
  expect(value.arguments[0].value).toBe(5)
})
