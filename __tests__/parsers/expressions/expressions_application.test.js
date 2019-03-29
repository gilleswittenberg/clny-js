const {
  toValue,
  parse
} = require("arcsecond")
const parser = require("../../../parsers/expressions/expressions")
const Identity = require("../../../tree/expressions/Identity")
const Application = require("../../../tree/expressions/scopes/Application")

describe("expressions application", () => {

  test("parens", () => {
    const value = toValue(parse(parser)("a()"))
    expect(value).toBeInstanceOf(Application)
    expect(value.expressions[0]).toBeInstanceOf(Identity)
  })
})
