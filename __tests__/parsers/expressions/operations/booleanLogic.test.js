const {
  toValue,
  parse
} = require("arcsecond")
const booleanLogic = require("../../../../parsers/expressions/operations/booleanLogic")

test("and", () => {
  expect(toValue(parse(booleanLogic)("true & true")).evaluate().value).toBe(true)
})

test("and", () => {
  expect(toValue(parse(booleanLogic)("true & true & false")).evaluate().value).toBe(false)
})

test("or", () => {
  expect(toValue(parse(booleanLogic)("true | false")).evaluate().value).toBe(true)
})

test("or", () => {
  expect(toValue(parse(booleanLogic)("true | false | false")).evaluate().value.value).toBe(true)
})

test("not", () => {
  expect(toValue(parse(booleanLogic)("!true")).evaluate().value).toBe(false)
})

test("not or", () => {
  expect(toValue(parse(booleanLogic)("!true | false")).evaluate().value.value).toBe(false)
})

test("precedence", () => {
  expect(toValue(parse(booleanLogic)("false | true & true")).evaluate().value.value).toBe(true)
  expect(toValue(parse(booleanLogic)("!false | (!true & true)")).evaluate().value.value).toBe(true)
})
