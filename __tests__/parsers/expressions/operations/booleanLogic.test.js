const {
  toValue,
  parse
} = require("arcsecond")
const expressions = require("../../../../parsers/expressions/expressions")

test("and", () => {
  expect(toValue(parse(expressions)("true & true")).evaluate()).toBe(true)
})

test("and", () => {
  expect(toValue(parse(expressions)("true & true & false")).evaluate()).toBe(false)
})

test("or", () => {
  expect(toValue(parse(expressions)("true | false")).evaluate()).toBe(true)
})

test("or", () => {
  expect(toValue(parse(expressions)("true | false | false")).evaluate()).toBe(true)
})

test("not", () => {
  expect(toValue(parse(expressions)("!true")).evaluate()).toBe(false)
})

test("not or", () => {
  expect(toValue(parse(expressions)("!true | false")).evaluate()).toBe(false)
})

test("precedence", () => {
  expect(toValue(parse(expressions)("false | true & true")).evaluate()).toBe(true)
  expect(toValue(parse(expressions)("!false | (!true & true)")).evaluate()).toBe(true)
})
