const {
  toValue,
  parse
} = require("arcsecond")
const expression = require("../../../parsers/expressions/expression")

test("null", () => {
  expect(toValue(parse(expression)("null")).evaluate().type).toBe("Null")
  expect(toValue(parse(expression)("( null )")).evaluate().value).toBe(null)
})

test("true", () => {
  expect(toValue(parse(expression)("true")).evaluate().type).toBe("Boolean")
  expect(toValue(parse(expression)("( true ) ")).evaluate().value).toBe(true)
})

test("number", () => {
  expect(toValue(parse(expression)("5")).evaluate().type).toBe("Number")
  expect(toValue(parse(expression)("5")).evaluate().value).toBe(5)
  expect(toValue(parse(expression)("(5)")).evaluate().value).toBe(5)
  expect(toValue(parse(expression)("( 5 ) ")).evaluate().value).toBe(5)
})

test("string", () => {
  expect(toValue(parse(expression)(`"ab"`)).evaluate().type).toBe("String") // eslint-disable-line quotes
  expect(toValue(parse(expression)(`( "ab" )`)).evaluate().value).toBe("ab") // eslint-disable-line quotes
})

test("type", () => {
  expect(toValue(parse(expression)("Number 5")).evaluate().value).toBe(5)
})
