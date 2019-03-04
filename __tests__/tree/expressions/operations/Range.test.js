const Range = require("../../../../tree/expressions/operations/Range")
const Number = require("../../../../tree/expressions/scalars/Number")

const createRange = (start, end) => new Range(new Number(start), new Number(end))

test("range", () => {
  expect(createRange(1, 2).evaluate()).toEqual([1,2])
  expect(createRange(1, 5).evaluate()).toEqual([1,2,3,4,5])
  expect(createRange(4, 0).evaluate()).toEqual([4,3,2,1,0])
  expect(createRange(-1, 3).evaluate()).toEqual([-1,0,1,2,3])
  expect(createRange(2, -3).evaluate()).toEqual([2,1,0,-1,-2,-3])
  expect(createRange(1, 1).evaluate()).toEqual([1])
})
