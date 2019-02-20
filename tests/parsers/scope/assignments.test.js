const {
  toValue,
  parse
} = require("arcsecond")
const assignments = require("../../../parsers/scope/assignments")

test("single", () => {
  const value = toValue(parse(assignments)("k: 5"))
  expect(value.length).toBe(1)
  expect(value[0].keys).toEqual(["k"])
  expect(value[0].expressions[0].value.value).toBe(5)
})

test("plural", () => {
  const value = toValue(parse(assignments)("l: 6, m: 7"))
  expect(value.length).toBe(2)
  expect(value[0].keys).toEqual(["l"])
  expect(value[0].expressions[0].value.value).toBe(6)
  expect(value[1].keys).toEqual(["m"])
  expect(value[1].expressions[0].value.value).toBe(7)
})

test("plural parens", () => {
  const value = toValue(parse(assignments)("(l: 6, m: 7 )"))
  expect(value.length).toBe(2)
})

// @TODO: "p: k: 7, l: 8" => p: (k: 7, l: 8)
// @TODO: "p: alias: k: 7, l: 8" => p: alias: (k: 7, l: 8)
// @TODO: "func: arg: Int -> {}" => func: (arg: Int) -> {}
//console.log(toValue(parse(assignments)("p: k: 7, l: 8")))
