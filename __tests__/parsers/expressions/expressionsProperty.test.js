const {
  toValue,
  parse
} = require("arcsecond")
const parser = require("../../../parsers/expressions/expressions")
const Property = require("../../../tree/expressions/Property")
const Identity = require("../../../tree/expressions/Identity")

describe("expressions chain", () => {

  test("single", () => {
    const value = toValue(parse(parser)("a.apply"))
    expect(value).toBeInstanceOf(Property)
    expect(value.key).toBe("apply")
    expect(value.parent).toBeInstanceOf(Identity)
  })

  test("many", () => {
    const value = toValue(parse(parser)("a.apply.snd"))
    expect(value).toBeInstanceOf(Property)
    expect(value.key).toBe("snd")
    expect(value.parent).toBeInstanceOf(Property)
    expect(value.parent.key).toBe("apply")
    expect(value.parent.parent).toBeInstanceOf(Identity)
  })
})
