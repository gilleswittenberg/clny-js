const {
  toValue,
  parse
} = require("arcsecond")
const { type } = require("../../parsers/keywords")

test("type", () => {
  expect(toValue(parse(type)("type"))).toBe("type")
})
