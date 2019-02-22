const {
  toValue,
  parse
} = require("arcsecond")
const { jsonType, jsonTypePlural } = require("../../../parsers/types/jsonType")

test("single", () => {
  expect(toValue(parse(jsonType)("Boolean"))).toEqual("Boolean")
})

test("plural", () => {
  expect(toValue(parse(jsonTypePlural)("Strings"))).toEqual("Strings")
})
