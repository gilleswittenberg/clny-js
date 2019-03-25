const {
  toValue,
  parse
} = require("arcsecond")
const parser = require("../../../parsers/expressions/expressions")
const Application = require("../../../tree/expressions/Application")
const Identity = require("../../../tree/expressions/Identity")
const Number = require("../../../tree/expressions/scalars/Number")
const Expression = require("../../../tree/expressions/Expression")

describe("expressions application by space", () => {

  test("single argument", () => {
    const value = toValue(parse(parser)("add 5"))
    expect(value).toBeInstanceOf(Application)
    expect(value.expressions[0]).toBeInstanceOf(Identity)
    expect(value.expressions[0].key).toBe("add")
    expect(value.arguments.length).toBe(1)
    expect(value.arguments[0]).toBeInstanceOf(Number)
    expect(value.arguments[0].value).toBe(5)
  })

  test("multiple spaces", () => {
    const value = toValue(parse(parser)("addSpaced    6"))
    expect(value).toBeInstanceOf(Application)
    expect(value.expressions[0]).toBeInstanceOf(Identity)
    expect(value.expressions[0].key).toBe("addSpaced")
    expect(value.arguments.length).toBe(1)
    expect(value.arguments[0]).toBeInstanceOf(Number)
    expect(value.arguments[0].value).toBe(6)
  })

  test("plural argument", () => {
    const value = toValue(parse(parser)("addArray 6, 7"))
    expect(value).toBeInstanceOf(Application)
    expect(value.expressions[0]).toBeInstanceOf(Identity)
    expect(value.expressions[0].key).toBe("addArray")
    expect(value.arguments.length).toBe(1)
    expect(value.arguments[0]).toBeInstanceOf(Expression)
    expect(value.arguments[0].isPlural).toBe(true)
    expect(value.arguments[0].expressions.length).toBe(2)
    expect(value.arguments[0].expressions[0]).toBeInstanceOf(Number)
    expect(value.arguments[0].expressions[0].value).toBe(6)
    expect(value.arguments[0].expressions[1]).toBeInstanceOf(Number)
    expect(value.arguments[0].expressions[1].value).toBe(7)
  })

  test("partial application", () => {
    const value = toValue(parse(parser)("addN 1 2"))
    expect(value).toBeInstanceOf(Application)
    expect(value.expressions[0]).toBeInstanceOf(Application)
    expect(value.expressions[0].expressions[0]).toBeInstanceOf(Identity)
    expect(value.expressions[0].arguments[0]).toBeInstanceOf(Number)
    expect(value.expressions[0].arguments[0].value).toBe(1)
    expect(value.expressions[0]).toBeInstanceOf(Application)
    expect(value.arguments[0]).toBeInstanceOf(Number)
    expect(value.arguments[0].value).toBe(2)
  })

  test("partial application", () => {
    const value = toValue(parse(parser)("addN addM 3"))
    expect(value).toBeInstanceOf(Application)
    expect(value.expressions[0]).toBeInstanceOf(Application)
    expect(value.expressions[0].expressions[0]).toBeInstanceOf(Identity)
    expect(value.expressions[0].arguments[0]).toBeInstanceOf(Identity)
    expect(value.expressions[0].arguments[0].key).toBe("addM")
    expect(value.expressions[0]).toBeInstanceOf(Application)
    expect(value.arguments[0]).toBeInstanceOf(Number)
    expect(value.arguments[0].value).toBe(3)
  })
})
