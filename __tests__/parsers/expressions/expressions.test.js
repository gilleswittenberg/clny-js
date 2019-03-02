const {
  toValue,
  parse
} = require("arcsecond")
const expressions = require("../../../parsers/expressions/expressions")

//const evaluateExpressions = expressions => expressions.map(expression.evaluate())

test("single", () => {
  expect(toValue(parse(expressions)("5")).length).toBe(1)
})

test("list", () => {
  expect(toValue(parse(expressions)("6, 7, 8")).length).toBe(3)
})

test("list parens", () => {
  expect(toValue(parse(expressions)("(7, 8, 9, 10 )")).length).toBe(4)
})

test("range", () => {
  expect(toValue(parse(expressions)("1,,5")).length).toBe(5)
})

xtest("one plural type", () => {
  const strings = toValue(parse(expressions)("Strings 5"))
  expect(strings.length).toEqual(1)
  expect(strings[0].evaluate().value).toEqual("5")
})

xtest("multi plural type", () => {
  const strings = toValue(parse(expressions)("Strings 6, 7, 89"))
  expect(strings.length).toEqual(3)
  expect(strings[0].evaluate().value).toEqual("6")
  expect(strings[1].evaluate().value).toEqual("7")
  expect(strings[2].evaluate().value).toEqual("89")
})
