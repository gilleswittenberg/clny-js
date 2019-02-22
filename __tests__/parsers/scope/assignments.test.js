const {
  toValue,
  parse
} = require("arcsecond")
const assignmentsParser = require("../../../parsers/scope/assignments")

test("single", () => {
  const assignments = toValue(parse(assignmentsParser)("k: 5"))
  assignments.forEach(assignment => assignment.evaluate())
  expect(assignments.length).toBe(1)
  expect(assignments[0].keys).toEqual(["k"])
  expect(assignments[0].expressions[0].value.value).toBe(5)
})

test("plural", () => {
  const assignments = toValue(parse(assignmentsParser)("l: 6, m: 7"))
  assignments.forEach(assignment => assignment.evaluate())
  expect(assignments.length).toBe(2)
  expect(assignments[0].keys).toEqual(["l"])
  expect(assignments[0].expressions[0].value.value).toBe(6)
  expect(assignments[1].keys).toEqual(["m"])
  expect(assignments[1].expressions[0].value.value).toBe(7)
})

test("plural parens", () => {
  const assignments = toValue(parse(assignmentsParser)("(l: 6, m: 7 )"))
  assignments.forEach(assignment => assignment.evaluate())
  expect(assignments.length).toBe(2)
})

// @TODO: "p: k: 7, l: 8" => p: (k: 7, l: 8)
// @TODO: "p: alias: k: 7, l: 8" => p: alias: (k: 7, l: 8)
// @TODO: "func: arg: Int -> {}" => func: (arg: Int) -> {}
//console.log(toValue(parse(assignmentsParser)("p: k: 7, l: 8")))
