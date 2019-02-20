const {
  toValue,
  parse
} = require("arcsecond")
const typeAssignment = require("../../../parsers/types/typeAssignment")

test("type statement", () => {
  expect(toValue(parse(typeAssignment)("type Null"))).toEqual(["Null"])
})

test("single", () => {
  expect(toValue(parse(typeAssignment)("False"))).toEqual(["False"])
})

test("sum", () => {
  expect(toValue(parse(typeAssignment)("Boolean: False | True"))).toEqual(["Boolean", [[null, ["False", "True"]]]])
})
