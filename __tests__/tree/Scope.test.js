const Scope = require("../../tree/Scope")
const Expression = require("../../tree/Expression")
const Assignment = require("../../tree/Assignment")
const Statement = require("../../tree/Statement")

test("empty", () => {
  const scope = new Scope()
  expect(scope.evaluate()).toEqual(null)
})

test("expression", () => {
  const expression = new Expression("5", "Number")
  const scope = new Scope([expression])
  expect(scope.hasOnlyExpressions()).toBe(true)
  expect(scope.evaluate()).toEqual([5])
})

test("expressions", () => {
  const expression = new Expression("6", "Number")
  const expression1 = new Expression("7", "Number")
  const scope = new Scope([expression, expression1])
  expect(scope.evaluate()).toEqual([6, 7])
})

test("expressions, assignments", () => {
  const expression = new Expression("8", "Number")
  const expression1 = new Expression("9", "Number")
  const assignment = new Assignment(["k"], [expression1])
  const scope = new Scope([expression, assignment])
  expect(scope.evaluate()).toEqual([8, { k: 9 }])
})

test("assignments", () => {
  const expression = new Expression("8", "Number")
  const expression1 = new Expression("9", "Number")
  const assignment = new Assignment(["kOne"], [expression])
  const assignment1 = new Assignment(["kTwo"], [expression1])
  const scope = new Scope([assignment, assignment1])
  expect(scope.evaluate()).toEqual({ kOne: 8, kTwo: 9 })
})

test("return statement", () => {
  const expression = new Expression("10", "Number")
  const statement = new Statement("return", [expression])
  const scope = new Scope([statement])
  expect(scope.evaluate()).toEqual([10])
})
