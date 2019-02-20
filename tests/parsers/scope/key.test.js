const {
  toValue,
  parse
} = require("arcsecond")
const key = require("../../../parsers/scope/key")

test("key", () => {
  expect(toValue(parse(key)("k"))).toBe("k")
  expect(toValue(parse(key)("camelCase"))).toBe("camelCase")
})
