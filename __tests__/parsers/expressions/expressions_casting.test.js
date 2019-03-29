const {
  toValue,
  parse
} = require("arcsecond")
const parser = require("../../../parsers/expressions/expressions")
const Expression = require("../../../tree/expressions/Expression")
const Number = require("../../../tree/expressions/scalars/Number")
const Type = require("../../../tree/types/Type")
const Application = require("../../../tree/expressions/scopes/Application")
const Operation = require("../../../tree/expressions/operations/Operation")
const Assignment = require("../../../tree/expressions/Assignment")

describe("cast", () => {

  test("scalar", () => {
    const value = toValue(parse(parser)("String 5"))
    expect(value).toBeInstanceOf(Application)
    expect(value.expressions[0]).toBeInstanceOf(Type)
    expect(value.arguments[0]).toBeInstanceOf(Number)
  })

  test("operation", () => {
    const value = toValue(parse(parser)("String 5 + 6"))
    expect(value).toBeInstanceOf(Application)
    expect(value.expressions[0]).toBeInstanceOf(Type)
    expect(value.arguments[0]).toBeInstanceOf(Operation)
  })

  test("plural", () => {
    const value = toValue(parse(parser)("Strings 5, 6"))
    expect(value).toBeInstanceOf(Application)
    expect(value.expressions[0]).toBeInstanceOf(Type)
    expect(value.arguments[0]).toBeInstanceOf(Expression)
    expect(value.arguments[0].isPlural).toBe(true)
    expect(value.arguments[0].expressions.length).toBe(2)
  })

  test("assignment", () => {
    const value = toValue(parse(parser)("k: (String 5)"))
    expect(value).toBeInstanceOf(Assignment)
    expect(value.expressions[0]).toBeInstanceOf(Application)
    expect(value.expressions[0].expressions[0]).toBeInstanceOf(Type)
    expect(value.expressions[0].arguments[0]).toBeInstanceOf(Number)
  })
})
