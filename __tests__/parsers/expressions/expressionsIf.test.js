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

test("elseif statement", () => {

  const value = toValue(parse(parser)("elseif b, scope"))
  expect(value).toBeInstanceOf(Statement)
  expect(value.name).toBe("elseif")
  expect(value.expressions[0].expressions.length).toBe(2)
  expect(value.expressions[0].expressions[0]).toBeInstanceOf(Identity)
  expect(value.expressions[0].expressions[1]).toBeInstanceOf(Identity)
})

test("else statement", () => {

  const value = toValue(parse(parser)("else scope"))
  expect(value).toBeInstanceOf(Statement)
  expect(value.name).toBe("else")
  expect(value.expressions.length).toBe(1)
  expect(value.expressions[0]).toBeInstanceOf(Identity)
})

// @TODO: Multiple conditionals eg. (if b, scope elseif bb, scopee else bbb, scopeee)
