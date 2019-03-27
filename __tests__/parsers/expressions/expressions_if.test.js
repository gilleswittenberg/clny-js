const {
  toValue,
  parse
} = require("arcsecond")
const parser = require("../../../parsers/expressions/expressions")
const Identity = require("../../../tree/expressions/Identity")
const Application = require("../../../tree/expressions/Application")

test("if statement", () => {

  const value = toValue(parse(parser)("if b, scope"))
  expect(value).toBeInstanceOf(Application)
  expect(value.expressions[0]).toBeInstanceOf(Identity)
  expect(value.expressions[0].key).toBe("if")
  expect(value.arguments[0].expressions.length).toBe(2)
  expect(value.arguments[0].expressions[0]).toBeInstanceOf(Identity)
  expect(value.arguments[0].expressions[0].key).toBe("b")
  expect(value.arguments[0].expressions[1]).toBeInstanceOf(Identity)
  expect(value.arguments[0].expressions[1].key).toBe("scope")
})

test("elseif statement", () => {

  const value = toValue(parse(parser)("elseif c, scope"))
  expect(value).toBeInstanceOf(Application)
  expect(value.expressions[0]).toBeInstanceOf(Identity)
  expect(value.expressions[0].key).toBe("elseif")
  expect(value.arguments[0].expressions.length).toBe(2)
  expect(value.arguments[0].expressions[0]).toBeInstanceOf(Identity)
  expect(value.arguments[0].expressions[0].key).toBe("c")
  expect(value.arguments[0].expressions[1]).toBeInstanceOf(Identity)
  expect(value.arguments[0].expressions[1].key).toBe("scope")
})

test("else statement", () => {

  const value = toValue(parse(parser)("else scope"))
  expect(value).toBeInstanceOf(Application)
  expect(value.expressions[0]).toBeInstanceOf(Identity)
  expect(value.expressions[0].key).toBe("else")
  expect(value.arguments.length).toBe(1)
  expect(value.arguments[0]).toBeInstanceOf(Identity)
  expect(value.arguments[0].key).toBe("scope")
})

// @TODO: Multiple conditionals eg. (if b, scope elseif bb, scopee else bbb, scopeee)
