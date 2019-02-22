const {
  toValue,
  parse
} = require("arcsecond")
const typeLiteral = require("../../../parsers/types/typeLiteral")

test("literals", () => {
  expect(toValue(parse(typeLiteral)("K"))).toBe("K")
  expect(toValue(parse(typeLiteral)("Capitalized"))).toBe("Capitalized")
})
