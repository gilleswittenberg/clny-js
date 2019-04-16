const {
  toValue,
  parse
} = require("arcsecond")
const root = require("../../parsers/root")
const rootScope = root(true)
const ParseError = require("../../tree/errors/ParseError")

describe("root indention", () => {

  test("invalid", () => {
    const content = `key:
    5`
    expect(() => toValue(parse(rootScope)(content))).toThrow(new ParseError(2, "Invalid indention"))
  })

  test("empty line", () => {
    const content = `key:
  5

  6
`
    expect(() => toValue(parse(rootScope)(content))).not.toThrow()
  })
})
