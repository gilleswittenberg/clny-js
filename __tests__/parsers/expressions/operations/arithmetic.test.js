const {
  toValue,
  parse
} = require("arcsecond")
const expressions = require("../../../../parsers/expressions/expressions")

test("number", () => {
  expect(toValue(parse(expressions)("5")).evaluate()).toBe(5)
})

test("addition", () => {
  expect(toValue(parse(expressions)("1+2")).evaluate()).toBe(3)
  expect(toValue(parse(expressions)("2+3+4")).evaluate()).toBe(9)
  expect(toValue(parse(expressions)("2+3+4+5")).evaluate()).toBe(14)
})

test("subtraction", () => {
  expect(toValue(parse(expressions)("2-1")).evaluate()).toBe(1)
  expect(toValue(parse(expressions)("3-2-1")).evaluate()).toBe(0)
  expect(toValue(parse(expressions)("9-3-2-1")).evaluate()).toBe(3)
})

test("combined", () => {
  expect(toValue(parse(expressions)("2+4-3")).evaluate()).toBe(3)
  expect(toValue(parse(expressions)("1-2+3")).evaluate()).toBe(2)
})

test("multiplication", () => {
  expect(toValue(parse(expressions)("1*2")).evaluate()).toBe(2)
  expect(toValue(parse(expressions)("1+2*3")).evaluate()).toBe(7)
  expect(toValue(parse(expressions)("(1+2)*3")).evaluate()).toBe(9)
})

test("division", () => {
  expect(toValue(parse(expressions)("2/1")).evaluate()).toBe(2)
  expect(toValue(parse(expressions)("6/2/3")).evaluate()).toBe(1)
  expect(toValue(parse(expressions)("6/(1*2)")).evaluate()).toBe(3)
})

test("exponentiation", () => {
  expect(toValue(parse(expressions)("3**2")).evaluate()).toBe(9)
  expect(toValue(parse(expressions)("2**2**3")).evaluate()).toBe(256)
  expect(toValue(parse(expressions)("2**2+1")).evaluate()).toBe(5)
})

test("whitespace", () => {
  expect(toValue(parse(expressions)("  2   ")).evaluate()).toBe(2)
  expect(toValue(parse(expressions)(" (  2  ) ")).evaluate()).toBe(2)
  expect(toValue(parse(expressions)(" (  2  +    5 )  -  1  ")).evaluate()).toBe(6)
  expect(toValue(parse(expressions)(" (1+2)/3  ")).evaluate()).toBe(1)
})

test("parentheses", () => {
  expect(toValue(parse(expressions)("(4)")).evaluate()).toBe(4)
  expect(toValue(parse(expressions)("((4))")).evaluate()).toBe(4)
  expect(toValue(parse(expressions)("(1+2)")).evaluate()).toBe(3)
  expect(toValue(parse(expressions)("1-(2+3)")).evaluate()).toBe(-4)
  expect(toValue(parse(expressions)("1+(2)+3")).evaluate()).toBe(6)
  expect(toValue(parse(expressions)("(1)+2")).evaluate()).toBe(3)
  expect(toValue(parse(expressions)("1+(2)")).evaluate()).toBe(3)
  expect(toValue(parse(expressions)("(1)+(2)")).evaluate()).toBe(3)
  expect(toValue(parse(expressions)("1+(2+3)")).evaluate()).toBe(6)
  expect(toValue(parse(expressions)("(1+2)+3")).evaluate()).toBe(6)
  expect(toValue(parse(expressions)("(1+2)+(2+3)")).evaluate()).toBe(8)
  expect(toValue(parse(expressions)("(1-2)+(2+3)")).evaluate()).toBe(4)
  expect(toValue(parse(expressions)("(1+2)-(2+3)")).evaluate()).toBe(-2)
  expect(toValue(parse(expressions)("5-(4-(3-2))")).evaluate()).toBe(2)
  expect(toValue(parse(expressions)("1-(2-3)")).evaluate()).toBe(2)
})

test("negation", () => {
  expect(toValue(parse(expressions)("-22")).evaluate()).toBe(-22)
  expect(toValue(parse(expressions)("-22-12")).evaluate()).toBe(-34)
  expect(toValue(parse(expressions)("-22 + -2")).evaluate()).toBe(-24)
  expect(toValue(parse(expressions)("-(-2)")).evaluate()).toBe(2)
  expect(toValue(parse(expressions)("-(5*(-2 + 1))")).evaluate()).toBe(5)
  expect(toValue(parse(expressions)("3--2")).evaluate()).toBe(5)
  expect(toValue(parse(expressions)("--2")).evaluate()).toBe(2)
})
