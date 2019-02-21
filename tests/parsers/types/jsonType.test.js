const {
  toValue,
  parse
} = require("arcsecond")
const jsonType = require("../../../parsers/types/jsonType")

test("Boolean", () => {
  expect(toValue(parse(jsonType)("Boolean"))).toEqual("Boolean")
})
