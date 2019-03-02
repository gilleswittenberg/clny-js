const {
  toValue,
  parse
} = require("arcsecond")
const expression = require("../../../parsers/expressions/expression")

xtest("null", () => {
  expect(toValue(parse(expression)("null")).evaluate().type).toBe("Null")
  expect(toValue(parse(expression)("( null )")).evaluate().value).toBe(null)
})

xtest("true", () => {
  expect(toValue(parse(expression)("true")).evaluate().type).toBe("Boolean")
  expect(toValue(parse(expression)("( true ) ")).evaluate().value).toBe(true)
})

xtest("number", () => {
  expect(toValue(parse(expression)("5")).evaluate().type).toBe("Number")
  expect(toValue(parse(expression)("5")).evaluate().value).toBe(5)
  expect(toValue(parse(expression)("(5)")).evaluate().value).toBe(5)
  expect(toValue(parse(expression)("( 5 ) ")).evaluate().value).toBe(5)
})

xtest("string", () => {
  expect(toValue(parse(expression)(`"ab"`)).evaluate().type).toBe("String") // eslint-disable-line quotes
  expect(toValue(parse(expression)(`( "ab" )`)).evaluate().value).toBe("ab") // eslint-disable-line quotes
})

xtest("type", () => {
  expect(toValue(parse(expression)("Number 5")).evaluate().value).toBe(5)
})
