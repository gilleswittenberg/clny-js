const Scope = require("../../../tree/expressions/Scope")
const Number = require("../../../tree/expressions/scalars/Number")
const Assignment = require("../../../tree/expressions/Assignment")
const Statement = require("../../../tree/Statement")

test("empty", () => {
  const scope = new Scope()
  expect(scope.keys).toEqual([])
  expect(scope.expressions).toEqual([])
  expect(scope.evaluate(true)).toEqual(null)
})

test("expression", () => {
  const expression = new Number(5)
  const scope = new Scope(null, [expression])
  expect(scope.evaluate(true)).toEqual([5])
})

test("expressions", () => {
  const expression = new Number(6)
  const expression1 = new Number(7)
  const scope = new Scope(null, [expression, expression1])
  expect(scope.evaluate(true)).toEqual([6, 7])
})

test("expressions, assignments", () => {
  const expression = new Number(8)
  const expression1 = new Number(9)
  const assignment = new Assignment(["k"], [expression1])
  const scope = new Scope(null, [expression, assignment])
  expect(scope.evaluate(true)).toEqual([8, { k: 9 }])
})

test("assignments", () => {
  const expression = new Number(8)
  const expression1 = new Number(9)
  const assignment = new Assignment(["kOne"], [expression])
  const assignment1 = new Assignment(["kTwo"], [expression1])
  const scope = new Scope(null, [assignment, assignment1])
  expect(scope.evaluate(true)).toEqual({ kOne: 8, kTwo: 9 })
})

xtest("return statement", () => {
  const expression = new Number(10)
  const statement = new Statement("return", [expression])
  const scope = new Scope(null, [statement])
  expect(scope.evaluate()).toEqual([10])
})
