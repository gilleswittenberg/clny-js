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
    expect(value.key.name).toBe("camelCasedName")
    expect(value.self).toBe(false)
  })

  test("embellishment", () => {
    const value = toValue(parse(parser)("divideByZero^"))
    expect(value).toBeInstanceOf(Identity)
    expect(value.key.name).toBe("divideByZero")
    expect(value.key.embellishment).toBe("^")
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
    expect(value.key.name).toBe("key")
    expect(value.self).toBe(true)
  })
})
