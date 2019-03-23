const {
  toValue,
  parse
} = require("arcsecond")
const parser = require("../../../parsers/expressions/identity")
const Identity = require("../../../tree/expressions/Identity")

describe("identity", () => {

  test("key", () => {
    const value = toValue(parse(parser)("camelCasedName"))
    expect(value).toBeInstanceOf(Identity)
    expect(value.key).toBe("camelCasedName")
    expect(value.self).toBe(false)
  })

  test("self", () => {
    const value = toValue(parse(parser)("."))
    expect(value).toBeInstanceOf(Identity)
    expect(value.key).toBe(null)
    expect(value.self).toBe(true)
  })

  test("self key", () => {
    const value = toValue(parse(parser)(".key"))
    expect(value).toBeInstanceOf(Identity)
    expect(value.key).toBe("key")
    expect(value.self).toBe(true)
  })
})
