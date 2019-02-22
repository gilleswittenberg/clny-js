const {
  toValue,
  parse
} = require("arcsecond")
const type = require("../../../parsers/types/type")

test("named", () => {
  expect(toValue(parse(type)("k: K"))).toEqual([["k", ["K"]]])
})

test("sum", () => {
  expect(toValue(parse(type)("sum: Number | Boolean"))).toEqual([ ["sum", ["Number", "Boolean"] ] ])
})

test("product", () => {
  expect(toValue(parse(type)("product: String, String"))).toEqual([ ["product", ["String"] ], [null, ["String"] ] ])
})

test("tuple", () => {
  expect(toValue(parse(type)("tuple: (String, String)"))).toEqual(["tuple", [ [null, ["String"] ], [null, ["String"] ] ] ])
})
