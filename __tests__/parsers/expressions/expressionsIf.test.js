const {
  toValue,
  parse
} = require("arcsecond")
const parser = require("../../../parsers/expressions/expressions")
const Identity = require("../../../tree/expressions/Identity")
const Statement = require("../../../tree/expressions/Statement")

test("if statement", () => {

  const value = toValue(parse(parser)("if b, scope"))
  expect(value).toBeInstanceOf(Statement)
  expect(value.name).toBe("if")
  expect(value.expressions[0].expressions.length).toBe(2)
  expect(value.expressions[0].expressions[0]).toBeInstanceOf(Identity)
  expect(value.expressions[0].expressions[1]).toBeInstanceOf(Identity)
})
