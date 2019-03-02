const {
  toValue,
  parse
} = require("arcsecond")
const parser = require("../../parsers/precedence")
const Identity = require("../../tree/expressions/Identity")
const Expression = require("../../tree/expressions/Expression")
const Number = require("../../tree/expressions/scalars/Number")
const Objects = require("../../tree/Objects")
const Operation = require("../../tree/expressions/operations/Operation")
const Assignment = require("../../tree/Assignment")

//const log = require("../../utils/dev/log")

test("single", () => {
  expect(toValue(parse(parser)("5"))).toBeInstanceOf(Expression)
  expect(toValue(parse(parser)("id"))).toBeInstanceOf(Identity)
  expect(toValue(parse(parser)("(6)"))).toBeInstanceOf(Expression)
})

test("arithmetic", () => {
  const value = toValue(parse(parser)("x + y"))
  expect(value).toBeInstanceOf(Operation)
  expect(value.operands.length).toBe(2)
  expect(value.operands[0]).toBeInstanceOf(Identity)
  expect(value.operands[1]).toBeInstanceOf(Identity)
})

test("plural numbers", () => {
  const value = toValue(parse(parser)("5, 6"))
  expect(value).toBeInstanceOf(Objects)
  expect(value.objects.length).toBe(2)
  expect(value.objects[0]).toBeInstanceOf(Expression)
  expect(value.objects[1]).toBeInstanceOf(Expression)
})

test("plural", () => {
  const value = toValue(parse(parser)("a, b"))
  expect(value).toBeInstanceOf(Objects)
  expect(value.objects.length).toBe(2)
  expect(value.objects[0]).toBeInstanceOf(Identity)
  expect(value.objects[1]).toBeInstanceOf(Identity)
})

test("plural many", () => {
  const value = toValue(parse(parser)("5, 6, s, 8"))
  expect(value.objects.length).toBe(4)
  expect(value.objects[0]).toBeInstanceOf(Expression)
  expect(value.objects[1]).toBeInstanceOf(Expression)
  expect(value.objects[2]).toBeInstanceOf(Identity)
  expect(value.objects[3]).toBeInstanceOf(Number)
  expect(value.objects[3].literal).toBe("8")
})

test("parens", () => {
  const value = toValue(parse(parser)("(a, b)"))
  expect(value).toBeInstanceOf(Objects)
  expect(value.objects.length).toBe(2)
  expect(value.objects[0]).toBeInstanceOf(Identity)
  expect(value.objects[1]).toBeInstanceOf(Identity)
})

test("plural arithmetic", () => {
  const value = toValue(parse(parser)("5 + 1, 6 + 1"))
  expect(value).toBeInstanceOf(Objects)
  expect(value.objects.length).toBe(2)
  expect(value.objects[0]).toBeInstanceOf(Operation)
  expect(value.objects[1]).toBeInstanceOf(Operation)
})

test("parens deep", () => {
  const value = toValue(parse(parser)("3, (6, (5) + 2)"))
  expect(value).toBeInstanceOf(Objects)
  expect(value.objects.length).toBe(2)
  expect(value.objects[0]).toBeInstanceOf(Expression)
  expect(value.objects[1]).toBeInstanceOf(Objects)
  expect(value.objects[1].objects.length).toBe(2)
})

test("single assignment", () => {
  const value = toValue(parse(parser)("k: 5"))
  expect(value).toBeInstanceOf(Assignment)
  expect(value.keys[0]).toBe("k")
  expect(value.expressions[0]).toBeInstanceOf(Expression)
  expect(value.expressions[0].literal).toBe("5")
})

test("plural assignments", () => {
  const value = toValue(parse(parser)("k: 6, l: 7"))
  expect(value).toBeInstanceOf(Objects)
  expect(value.objects.length).toBe(2)
})

test("plural assignments", () => {
  //log(toValue(parse(parser)("5: 6")))
  //log(toValue(parse(parser)("arr: 5, 6")))
  //log(toValue(parse(parser)("k: l: 6")))
  //log(toValue(parse(parser)("k: l: 6, m: 7")))
  //log(toValue(parse(parser)("7, k: 8, 9")))
  //log(toValue(parse(parser)("obj: (a: 5, b: 6)")))
})

// arr: 5, 6
// k: l: 6
// k: l: 6, m: 8
// k: 7, 8
// 7, k: 8, 9
// obj: (a: 5, b: 6)
