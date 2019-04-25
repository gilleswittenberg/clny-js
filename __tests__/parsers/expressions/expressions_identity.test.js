const {
  toValue,
  parse
} = require("arcsecond")
const parser = require("../../../parsers/expressions/expressions")
const Property = require("../../../tree/expressions/Property")
const Identity = require("../../../tree/expressions/Identity")
const Number = require("../../../tree/expressions/scalars/Number")

describe("identity", () => {

  test("self", () => {
    const value = toValue(parse(parser)("."))
    expect(value).toBeInstanceOf(Identity)
    expect(value.self).toBe(true)
    expect(value.key).toBe(null)
  })

  test("self reference", () => {
    const value = toValue(parse(parser)(".prop"))
    expect(value).toBeInstanceOf(Identity)
    expect(value.self).toBe(true)
    expect(value.key.name).toBe("prop")
  })
})

describe("properties", () => {

  test("single", () => {
    const value = toValue(parse(parser)("a.apply"))
    expect(value).toBeInstanceOf(Property)
    expect(value.key.name).toBe("apply")
    expect(value.expressions[0]).toBeInstanceOf(Identity)
  })

  test("deep", () => {
    const value = toValue(parse(parser)("a.apply.snd"))
    expect(value).toBeInstanceOf(Property)
    expect(value.key.name).toBe("snd")
    expect(value.expressions[0]).toBeInstanceOf(Property)
    expect(value.expressions[0].key.name).toBe("apply")
    expect(value.expressions[0].expressions[0]).toBeInstanceOf(Identity)
  })

  test("on expression", () => {
    const value = toValue(parse(parser)("5.equals"))
    expect(value).toBeInstanceOf(Property)
    expect(value.key.name).toBe("equals")
    expect(value.expressions[0]).toBeInstanceOf(Number)
  })
})
