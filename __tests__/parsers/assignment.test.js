const {
  toValue,
  parse
} = require("arcsecond")
const parser = require("../../parsers/assignment")
const Assignment = require("../../tree/expressions/Assignment")
const Number = require("../../tree/expressions/scalars/Number")
const Application = require("../../tree/expressions/scopes/Application")

describe("assignment", () => {

  test("plural", () => {
    const result = toValue(parse(parser)("key: a: 6, b: 7"))
    expect(result).toBeInstanceOf(Assignment)
    expect(result.keys).toEqual(["key"])
    expect(result.expressions[0].expressions.length).toBe(2)
    expect(result.expressions[0].expressions[0]).toBeInstanceOf(Assignment)
    expect(result.expressions[0].expressions[0].keys).toEqual(["a"])
    expect(result.expressions[0].expressions[1]).toBeInstanceOf(Assignment)
    expect(result.expressions[0].expressions[1].keys).toEqual(["b"])
  })

  test("function", () => {
    const result = toValue(parse(parser)("f: n: Number, m: Number -> Number m + n"))
    expect(result).toBeInstanceOf(Assignment)
    expect(result.keys).toEqual(["f"])
    expect(result.expressions[0]).toBeInstanceOf(Application)
    expect(result.expressions[0].expressions[0].inputs[0].expressions.length).toBe(2)
    expect(result.expressions[0].arguments.length).toBe(1)
  })
})

describe("aliases", () => {

  test("alias", () => {
    const result = toValue(parse(parser)("kk: alias:: 8"))
    expect(result).toBeInstanceOf(Assignment)
    expect(result.keys).toEqual(["kk", "alias"])
    expect(result.expressions.length).toBe(1)
    expect(result.expressions[0]).toBeInstanceOf(Number)
  })

  test("plural alias", () => {
    const result = toValue(parse(parser)("kkk: alias: aliasSnd:: 9"))
    expect(result).toBeInstanceOf(Assignment)
    expect(result.keys).toEqual(["kkk", "alias", "aliasSnd"])
    expect(result.expressions.length).toBe(1)
    expect(result.expressions[0]).toBeInstanceOf(Number)
  })
})
