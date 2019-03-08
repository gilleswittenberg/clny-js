const {
  toValue,
  parse
} = require("arcsecond")
const parser = require("../../../parsers/expressions/expressions")
const Chain = require("../../../tree/expressions/Chain")
const Identity = require("../../../tree/expressions/Identity")

describe("expressions chain", () => {

  test("single", () => {
    const value = toValue(parse(parser)("a.apply"))
    expect(value).toBeInstanceOf(Chain)
    expect(value.key).toBe("apply")
    expect(value.parent).toBeInstanceOf(Identity)
  })

  test("many", () => {
    const value = toValue(parse(parser)("a.apply.snd"))
    expect(value).toBeInstanceOf(Chain)
    expect(value.key).toBe("snd")
    expect(value.parent).toBeInstanceOf(Chain)
    expect(value.parent.key).toBe("apply")
    expect(value.parent.parent).toBeInstanceOf(Identity)
  })
})
