const Range = require("../../../../tree/expressions/operations/Range")

test("range", () => {
  expect(new Range(1, 2).evaluate()).toEqual([1,2])
  expect(new Range(1, 5).evaluate()).toEqual([1,2,3,4,5])
  expect(new Range(4, 0).evaluate()).toEqual([4,3,2,1,0])
  expect(new Range(-1, 3).evaluate()).toEqual([-1,0,1,2,3])
  expect(new Range(2, -3).evaluate()).toEqual([2,1,0,-1,-2,-3])
  expect(new Range(1, 1).evaluate()).toEqual([1])
})
