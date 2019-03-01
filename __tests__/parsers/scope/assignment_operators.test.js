const {
  toValue,
  parse
} = require("arcsecond")
const {
  Expression,
  Assignment,
  Identity,
  assignment: assignmentParser
} = require("../../../parsers/scope/assignments_operators")

const log = require("../../../utils/dev/log")

// single
test("key, values", () => {
  const assignment = toValue(parse(assignmentParser)("k: 5"))
  expect(assignment.key).toBe("k")
  expect(assignment.objects[0]).toBeInstanceOf(Expression)
  expect(assignment.objects[0].value).toBe("5")
})

test("key, identity", () => {
  const assignment = toValue(parse(assignmentParser)("k: a"))
  expect(assignment.key).toBe("k")
  expect(assignment.objects[0]).toBeInstanceOf(Identity)
  expect(assignment.objects[0].value).toBe("a")
})

// plural
test("key, plural values", () => {
  const assignment = toValue(parse(assignmentParser)("plural: 7, 8"))
  expect(assignment.key).toBe("plural")
  expect(assignment.objects[0]).toBeInstanceOf(Expression)
  expect(assignment.objects[0].value).toEqual("7")
  expect(assignment.objects[1]).toBeInstanceOf(Expression)
  expect(assignment.objects[1].value).toEqual("8")
})

// plural
test("key, plural identity", () => {
  const assignment = toValue(parse(assignmentParser)("plural: b, c"))
  expect(assignment.key).toBe("plural")
  expect(assignment.objects[0]).toBeInstanceOf(Identity)
  expect(assignment.objects[0].value).toEqual("b")
  expect(assignment.objects[1]).toBeInstanceOf(Identity)
  expect(assignment.objects[1].value).toEqual("c")
})

// named
test("key, single named values", () => {
  const assignment = toValue(parse(assignmentParser)("kk: d: 6"))
  expect(assignment.key).toBe("kk")
  expect(assignment.objects[0]).toBeInstanceOf(Assignment)
  expect(assignment.objects[0].key).toBe("d")
  expect(assignment.objects[0].objects[0]).toBeInstanceOf(Expression)
  expect(assignment.objects[0].objects[0].value).toBe("6")
})

test("key, single named identity", () => {
  const assignment = toValue(parse(assignmentParser)("ki: d: e"))
  expect(assignment.key).toBe("ki")
  expect(assignment.objects[0]).toBeInstanceOf(Assignment)
  expect(assignment.objects[0].key).toBe("d")
  expect(assignment.objects[0].objects[0]).toBeInstanceOf(Identity)
  expect(assignment.objects[0].objects[0].value).toBe("e")
})

test("key, plural named values", () => {

   // (named: ((k: 9), (l: 10)))
  const assignment = toValue(parse(assignmentParser)("named: k: 9, l: 10"))

  expect(assignment.key).toBe("named")

  expect(assignment.objects[0]).toBeInstanceOf(Assignment)
  expect(assignment.objects[0].key).toBe("k")
  expect(assignment.objects[0].objects[0]).toBeInstanceOf(Expression)
  expect(assignment.objects[0].objects[0].value).toBe("9")

  expect(assignment.objects[1]).toBeInstanceOf(Assignment)
  expect(assignment.objects[1].key).toBe("l")
  expect(assignment.objects[1].objects[0]).toBeInstanceOf(Expression)
  expect(assignment.objects[1].objects[0].value).toBe("10")
})

test("deep", () => {
  // (k: ((kk: (kkk: 8)), (ll: 10)))
  const assignment = toValue(parse(assignmentParser)("k: kk: kkk: 8, ll: 9)"))

  expect(assignment.key).toBe("k")

  expect(assignment.objects[0]).toBeInstanceOf(Assignment)
  expect(assignment.objects[0].key).toBe("kk")
  expect(assignment.objects[0].objects[0]).toBeInstanceOf(Assignment)
  expect(assignment.objects[0].objects[0].key).toBe("kkk")
  expect(assignment.objects[0].objects[0].objects[0]).toBeInstanceOf(Expression)
  expect(assignment.objects[0].objects[0].objects[0].value).toBe("8")

  expect(assignment.objects[1].key).toBe("ll")
  expect(assignment.objects[1].objects[0]).toBeInstanceOf(Expression)
  expect(assignment.objects[1].objects[0].value).toBe("9")
})

test("first key, expression, assignment", () => {
  const assignment = toValue(parse(assignmentParser)("k: 8, l: 9"))
  expect(assignment.objects.length).toBe(2)
  expect(assignment.objects[0]).toBeInstanceOf(Expression)
  expect(assignment.objects[0].value).toBe("8")
  expect(assignment.objects[1]).toBeInstanceOf(Assignment)
  expect(assignment.objects[1].key).toBe("l")
})

test("first key, assignment, expression", () => {
  const assignment = toValue(parse(assignmentParser)("k: l: 8, 9"))
  expect(assignment.objects.length).toBe(2)
  expect(assignment.objects[0]).toBeInstanceOf(Assignment)
  expect(assignment.objects[0].key).toBe("l")
  expect(assignment.objects[1]).toBeInstanceOf(Expression)
  expect(assignment.objects[1].value).toBe("9")
})

test("parenthesized named array", () => {
  const assignment = toValue(parse(assignmentParser)("(k: 8, l: 9)"))
  expect(assignment.length).toBe(2)
  expect(assignment[0]).toBeInstanceOf(Assignment)
  expect(assignment[0].key).toBe("k")
  expect(assignment[1]).toBeInstanceOf(Assignment)
  expect(assignment[1].key).toBe("l")
})

// @TODO:
test("parentheses", () => {
  //const assignment = toValue(parse(assignmentParser)("(named: (k: (9), l: 10))"))
  //const assignment = toValue(parse(assignmentParser)("(named: (k: 9), (l: 10)))"))
  //const assignment = toValue(parse(assignmentParser)("(named: (k: 9, l: 10))"))
  //log(assignment)
})

// @TODO: precedence ( ("()", PARENS), (":", RIGHT), ("," LEFT) )
// @TODO: aliases (id: identity:: true)
// @TODO: newlines, indents, scopes
