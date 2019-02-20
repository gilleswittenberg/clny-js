const {
  toValue,
  parse
} = require("arcsecond")
const expression = require("../../../parsers/expressions/expression")

test("null", () => {
  expect(toValue(parse(expression)("null")).value.type).toBe("Null")
  expect(toValue(parse(expression)("( null )")).value.value).toBe(null)
})

test("true", () => {
  expect(toValue(parse(expression)("true")).value.type).toBe("Boolean")
  expect(toValue(parse(expression)("( true ) ")).value.value).toBe(true)
})

test("number", () => {
  expect(toValue(parse(expression)("5")).value.type).toBe("Number")
  expect(toValue(parse(expression)("5")).value.value).toBe(5)
  expect(toValue(parse(expression)("(5)")).value.value).toBe(5)
  expect(toValue(parse(expression)("( 5 ) ")).value.value).toBe(5)
})

test("string", () => {
  expect(toValue(parse(expression)(`"ab"`)).value.type).toBe("String")
  expect(toValue(parse(expression)(`( "ab" )`)).value.value).toBe("ab")
})

test("type", () => {
  expect(toValue(parse(expression)("Number 5")).value.value).toBe(5)
})
