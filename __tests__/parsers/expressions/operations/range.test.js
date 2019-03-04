const {
  toValue,
  parse
} = require("arcsecond")
const range = require("../../../../parsers/expressions/operations/range")

const toNumbers = arr => arr.map(expression => expression.value)

test("range", () => {
  expect(toNumbers(toValue(parse(range)("1,,2")))).toEqual([1,2])
  expect(toNumbers(toValue(parse(range)("1,,5")))).toEqual([1,2,3,4,5])
  expect(toNumbers(toValue(parse(range)("4,,0")))).toEqual([4,3,2,1,0])
  //expect(toNumbers(toValue(parse(range)("-1,,3")))).toEqual([-1,0,1,2,3])
  //expect(toNumbers(toValue(parse(range)("2,,-3")))).toEqual([2,1,0,-1,-2,-3])
  expect(toNumbers(toValue(parse(range)("1,,1")))).toEqual([1])
})

test("whitespace", () => {
  expect(toNumbers(toValue(parse(range)("1 ,,  2 ")))).toEqual([1,2])
})
