const {
  toValue,
  parse
} = require("arcsecond")
const parser = require("../../../parsers/expressions/expressions")
const Number = require("../../../tree/expressions/scalars/Number")
const Operation = require("../../../tree/expressions/operations/Operation")
const ForStatement = require("../../../tree/expressions/ForStatement")

describe("for statement", () => {

  test("number", () => {
    const value = toValue(parse(parser)("for 5"))
    expect(value).toBeInstanceOf(ForStatement)
    expect(value.name).toBe("for")
    expect(value.expressions.length).toBe(1)
    expect(value.expressions[0]).toBeInstanceOf(Number)
  })

  test("plural", () => {
    const value = toValue(parse(parser)("for 5, 6, 7"))
    expect(value).toBeInstanceOf(ForStatement)
    expect(value.name).toBe("for")
    expect(value.expressions.length).toBe(1)
    expect(value.expressions[0].isPlural).toBe(true)
    expect(value.expressions[0].expressions[0]).toBeInstanceOf(Number)
    expect(value.expressions[0].expressions[1]).toBeInstanceOf(Number)
    expect(value.expressions[0].expressions[2]).toBeInstanceOf(Number)
  })

  test("range", () => {
    const value = toValue(parse(parser)("for 1,,4"))
    expect(value).toBeInstanceOf(ForStatement)
    expect(value.name).toBe("for")
    expect(value.expressions.length).toBe(1)
    expect(value.expressions[0]).toBeInstanceOf(Operation)
  })
})
