const {
  toValue,
  parse
} = require("arcsecond")
const expressions = require("../../../parsers/expressions/expressions")
const Type = require("../../../tree/types/Type")
const Property = require("../../../tree/expressions/Property")

describe("expressions type properties", () => {

  test("Impure", () => {
    const value = toValue(parse(expressions)("String.impure"))
    expect(value).toBeInstanceOf(Property)
    expect(value.key.name).toBe("impure")
    expect(value.expressions[0]).toBeInstanceOf(Type)
    expect(value.expressions[0].name).toBe("String")
  })
})
