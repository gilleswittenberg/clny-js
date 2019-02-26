const {
  toValue,
  parse
} = require("arcsecond")
const number = require("../../../../parsers/expressions/numbers/number")

const evaluatedValue = result => toValue(result).evaluate().value

test("int", () => {
  expect(evaluatedValue(parse(number)("5"))).toBe(5)
  expect(evaluatedValue(parse(number)("523"))).toBe(523)
  expect(evaluatedValue(parse(number)("1_000_000"))).toBe(1000000)
  expect(evaluatedValue(parse(number)("1_______"))).toBe(1)
})

test("float", () => {
  expect(evaluatedValue(parse(number)("1.2"))).toBe(1.2)
  expect(evaluatedValue(parse(number)("0.1"))).toBe(0.1)
  expect(evaluatedValue(parse(number)("3."))).toBe(3)
  expect(evaluatedValue(parse(number)("3_0_.2_5_"))).toBe(30.25)
})

test("leading zeros", () => {
  expect(evaluatedValue(parse(number)("06"))).toBe(6)
  expect(evaluatedValue(parse(number)("000.23"))).toBe(0.23)
})

test("scientific", () => {
  expect(evaluatedValue(parse(number)("1e1"))).toBe(10)
  expect(evaluatedValue(parse(number)("1.2e-1"))).toBe(0.12)
  expect(evaluatedValue(parse(number)("12E2"))).toBe(1200)
})
