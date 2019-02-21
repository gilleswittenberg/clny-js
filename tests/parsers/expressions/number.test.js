const {
  toValue,
  parse
} = require("arcsecond")
const number = require("../../../parsers/expressions/number")

test("int", () => {
  expect(toValue(parse(number)("5"))).toBe(5)
  expect(toValue(parse(number)("523"))).toBe(523)
})

test("float", () => {
  expect(toValue(parse(number)("1.2"))).toBe(1.2)
  expect(toValue(parse(number)("0.1"))).toBe(0.1)
})

test("leading zeros", () => {
  expect(toValue(parse(number)("06"))).toBe(6)
  expect(toValue(parse(number)("000.23"))).toBe(0.23)
})

test("negative", () => {
  expect(toValue(parse(number)("-9"))).toBe(-9)
  expect(toValue(parse(number)("-1.2"))).toBe(-1.2)
})

test("arithmatic", () => {
  expect(toValue(parse(number)("6 + 7"))).toBe(13)
  expect(toValue(parse(number)("6 - 7"))).toBe(-1)
  expect(toValue(parse(number)("6 * 7"))).toBe(42)
  expect(toValue(parse(number)("6 / 2"))).toBe(3)
})
