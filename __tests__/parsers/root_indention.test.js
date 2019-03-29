const {
  toValue,
  parse
} = require("arcsecond")
const root = require("../../parsers/root")
const rootScope = root(true)

describe("root indention", () => {

  test("invalid", () => {
    const content = `key:
    5`
    expect(() => toValue(parse(rootScope)(content))).toThrow("Invalid indention at line: 2")
  })

  test("empty line", () => {
    const content = `key:
  5

  6
`
    expect(() => toValue(parse(rootScope)(content))).not.toThrow()
  })
})
