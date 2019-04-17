const {
  toValue,
  parse
} = require("arcsecond")
const key = require("../../parsers/key")

describe("key", () => {

  test("body", () => {
    expect(toValue(parse(key)("k")).name).toBe("k")
    expect(toValue(parse(key)("camelCase")).name).toBe("camelCase")
  })

  test("prefix", () => {
    const value = toValue(parse(key)("_k"))
    expect(value.name).toBe("k")
    expect(value.visibility).toBe("PRIVATE")
  })

  test("embellishment", () => {
    const value = toValue(parse(key)("state$"))
    expect(value.name).toBe("state")
    expect(value.embellishment).toBe("$")
  })
})
