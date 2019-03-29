const {
  toValue,
  parse
} = require("arcsecond")
const { type, key } = require("../../parsers/keywords")

describe("keywords", () => {

  test("type", () => {
    expect(toValue(parse(type)("type"))).toBe("type")
  })

  test("key", () => {
    expect(toValue(parse(key)("key"))).toBe("key")
  })
})
