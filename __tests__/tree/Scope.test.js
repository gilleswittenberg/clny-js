const Scope = require("../../tree/Scope")
const Number = require("../../tree/expressions/scalars/Number")
const Assignment = require("../../tree/expressions/Assignment")
const Statement = require("../../tree/Statement")

xtest("empty", () => {
  const scope = new Scope()
  expect(scope.evaluate()).toEqual(null)
})

xtest("expression", () => {
  const expression = new Number(5)
  const scope = new Scope([expression])
  expect(scope.hasOnlyExpressions()).toBe(true)
  expect(scope.evaluate()).toEqual([5])
})

xtest("expressions", () => {
  const expression = new Number(6)
  const expression1 = new Number(7)
  const scope = new Scope([expression, expression1])
  expect(scope.evaluate()).toEqual([6, 7])
})

xtest("expressions, assignments", () => {
  const expression = new Number(8)
  const expression1 = new Number(9)
  const assignment = new Assignment(["k"], [expression1])
  const scope = new Scope([expression, assignment])
  expect(scope.evaluate()).toEqual([8, { k: 9 }])
})

xtest("assignments", () => {
  const expression = new Number(8)
  const expression1 = new Number(9)
  const assignment = new Assignment(["kOne"], [expression])
  const assignment1 = new Assignment(["kTwo"], [expression1])
  const scope = new Scope([assignment, assignment1])
  expect(scope.evaluate()).toEqual({ kOne: 8, kTwo: 9 })
})

xtest("return statement", () => {
  const expression = new Number(10)
  const statement = new Statement("return", [expression])
  const scope = new Scope([statement])
  expect(scope.evaluate()).toEqual([10])
})
