const {
  toValue,
  parse
} = require("arcsecond")
const key = require("../../parsers/key")

test("key", () => {
  expect(toValue(parse(key)("k")).name).toBe("k")
  expect(toValue(parse(key)("camelCase")).name).toBe("camelCase")
})
