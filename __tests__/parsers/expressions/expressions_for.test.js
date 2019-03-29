const {
  toValue,
  parse
} = require("arcsecond")
const parser = require("../../../parsers/expressions/expressions")
const Number = require("../../../tree/expressions/scalars/Number")
const Operation = require("../../../tree/expressions/operations/Operation")
const Application = require("../../../tree/expressions/Application")
const Identity = require("../../../tree/expressions/Identity")
const Expression = require("../../../tree/expressions/Expression")
//const ForStatement = require("../../../tree/expressions/statements/ForStatement")

describe("for statement", () => {

  test("number", () => {
    const value = toValue(parse(parser)("for 4"))
    expect(value).toBeInstanceOf(Application)
    expect(value.expressions[0]).toBeInstanceOf(Identity)
    expect(value.expressions[0].key).toBe("for")
    expect(value.arguments.length).toBe(1)
    expect(value.arguments[0]).toBeInstanceOf(Number)
    expect(value.arguments[0].value).toBe(4)
  })

  test("plural", () => {
    const value = toValue(parse(parser)("for 5, 6, 7"))
    expect(value).toBeInstanceOf(Application)
    expect(value.expressions[0]).toBeInstanceOf(Identity)
    expect(value.expressions[0].key).toBe("for")
    expect(value.arguments[0]).toBeInstanceOf(Expression)
    expect(value.arguments[0].isPlural).toBe(true)
    expect(value.arguments[0].expressions[0]).toBeInstanceOf(Number)
    expect(value.arguments[0].expressions[0].value).toBe(5)
    expect(value.arguments[0].expressions[1]).toBeInstanceOf(Number)
    expect(value.arguments[0].expressions[1].value).toBe(6)
    expect(value.arguments[0].expressions[2]).toBeInstanceOf(Number)
    expect(value.arguments[0].expressions[2].value).toBe(7)
  })

  test("range", () => {
    const value = toValue(parse(parser)("for 1,,4"))
    expect(value).toBeInstanceOf(Application)
    expect(value.expressions[0]).toBeInstanceOf(Identity)
    expect(value.expressions[0].key).toBe("for")
    expect(value.arguments.length).toBe(1)
    expect(value.arguments[0]).toBeInstanceOf(Operation)
  })
})
