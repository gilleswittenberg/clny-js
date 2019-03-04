const {
  toValue,
  parse
} = require("arcsecond")
const arithmetic = require("../../../../parsers/expressions/operations/arithmetic")

xtest("", () => {})
xtest("number", () => {
  expect(toValue(parse(arithmetic)("5")).evaluate().value).toBe(5)
})

xtest("addition", () => {
  expect(toValue(parse(arithmetic)("1+2")).evaluate().value).toBe(3)
  expect(toValue(parse(arithmetic)("2+3+4")).evaluate().value).toBe(9)
  expect(toValue(parse(arithmetic)("2+3+4+5")).evaluate().value).toBe(14)
})

xtest("subtraction", () => {
  expect(toValue(parse(arithmetic)("2-1")).evaluate().value).toBe(1)
  expect(toValue(parse(arithmetic)("3-2-1")).evaluate().value).toBe(0)
  expect(toValue(parse(arithmetic)("9-3-2-1")).evaluate().value).toBe(3)
})

xtest("combined", () => {
  expect(toValue(parse(arithmetic)("2+4-3")).evaluate().value).toBe(3)
  expect(toValue(parse(arithmetic)("1-2+3")).evaluate().value).toBe(2)
})

xtest("multiplication", () => {
  expect(toValue(parse(arithmetic)("1*2")).evaluate().value).toBe(2)
  expect(toValue(parse(arithmetic)("1+2*3")).evaluate().value).toBe(7)
  expect(toValue(parse(arithmetic)("(1+2)*3")).evaluate().value).toBe(9)
})

xtest("division", () => {
  expect(toValue(parse(arithmetic)("2/1")).evaluate().value).toBe(2)
  expect(toValue(parse(arithmetic)("6/2/3")).evaluate().value).toBe(1)
  expect(toValue(parse(arithmetic)("6/(1*2)")).evaluate().value).toBe(3)
})

xtest("exponentiation", () => {
  expect(toValue(parse(arithmetic)("3**2")).evaluate().value).toBe(9)
  expect(toValue(parse(arithmetic)("2**2**3")).evaluate().value).toBe(256)
  expect(toValue(parse(arithmetic)("2**2+1")).evaluate().value).toBe(5)
})

xtest("whitespace", () => {
  expect(toValue(parse(arithmetic)("  2   ")).evaluate().value).toBe(2)
  expect(toValue(parse(arithmetic)(" (  2  ) ")).evaluate().value).toBe(2)
  expect(toValue(parse(arithmetic)(" (  2  +    5 )  -  1  ")).evaluate().value).toBe(6)
  expect(toValue(parse(arithmetic)(" (1+2)/3  ")).evaluate().value).toBe(1)
})

xtest("parentheses", () => {
  expect(toValue(parse(arithmetic)("(4)")).evaluate().value).toBe(4)
  expect(toValue(parse(arithmetic)("((4))")).evaluate().value).toBe(4)
  expect(toValue(parse(arithmetic)("(1+2)")).evaluate().value).toBe(3)
  expect(toValue(parse(arithmetic)("1-(2+3)")).evaluate().value).toBe(-4)
  expect(toValue(parse(arithmetic)("1+(2)+3")).evaluate().value).toBe(6)
  expect(toValue(parse(arithmetic)("(1)+2")).evaluate().value).toBe(3)
  expect(toValue(parse(arithmetic)("1+(2)")).evaluate().value).toBe(3)
  expect(toValue(parse(arithmetic)("(1)+(2)")).evaluate().value).toBe(3)
  expect(toValue(parse(arithmetic)("1+(2+3)")).evaluate().value).toBe(6)
  expect(toValue(parse(arithmetic)("(1+2)+3")).evaluate().value).toBe(6)
  expect(toValue(parse(arithmetic)("(1+2)+(2+3)")).evaluate().value).toBe(8)
  expect(toValue(parse(arithmetic)("(1-2)+(2+3)")).evaluate().value).toBe(4)
  expect(toValue(parse(arithmetic)("(1+2)-(2+3)")).evaluate().value).toBe(-2)
  expect(toValue(parse(arithmetic)("5-(4-(3-2))")).evaluate().value).toBe(2)
  expect(toValue(parse(arithmetic)("1-(2-3)")).evaluate().value).toBe(2)
})

xtest("negation", () => {
  expect(toValue(parse(arithmetic)("-22")).evaluate().value).toBe(-22)
  expect(toValue(parse(arithmetic)("-22-12")).evaluate().value).toBe(-34)
  expect(toValue(parse(arithmetic)("-22 + -2")).evaluate().value).toBe(-24)
  expect(toValue(parse(arithmetic)("-(-2)")).evaluate().value).toBe(2)
  expect(toValue(parse(arithmetic)("-(5*(-2 + 1))")).evaluate().value).toBe(5)
  expect(toValue(parse(arithmetic)("3--2")).evaluate().value).toBe(5)
  expect(toValue(parse(arithmetic)("--2")).evaluate().value).toBe(2)
})
