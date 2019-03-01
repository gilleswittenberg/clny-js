const {
  toValue,
  parse
} = require("arcsecond")
const parser = require("../../parsers/precedence")
const Identity = require("../../tree/Identity")
const Expression = require("../../tree/Expression")
const Objects = require("../../tree/Objects")
const Arithmetic = require("../../tree/Arithmetic")
const Assignment = require("../../tree/Assignment")

//const log = require("../../utils/dev/log")

test("single", () => {
  expect(toValue(parse(parser)("5"))).toBeInstanceOf(Expression)
  expect(toValue(parse(parser)("id"))).toBeInstanceOf(Identity)
  expect(toValue(parse(parser)("(6)"))).toBeInstanceOf(Expression)
})

test("arithmetic", () => {
  const value = toValue(parse(parser)("x + y"))
  expect(value).toBeInstanceOf(Arithmetic)
  expect(value.expressions.length).toBe(2)
  expect(value.expressions[0]).toBeInstanceOf(Identity)
  expect(value.expressions[1]).toBeInstanceOf(Identity)
})

test("plural numbers", () => {
  const value = toValue(parse(parser)("5, 6"))
  expect(value).toBeInstanceOf(Objects)
  expect(value.expressions.length).toBe(2)
  expect(value.expressions[0]).toBeInstanceOf(Expression)
  expect(value.expressions[1]).toBeInstanceOf(Expression)
})

test("plural", () => {
  const value = toValue(parse(parser)("a, b"))
  expect(value).toBeInstanceOf(Objects)
  expect(value.expressions.length).toBe(2)
  expect(value.expressions[0]).toBeInstanceOf(Identity)
  expect(value.expressions[1]).toBeInstanceOf(Identity)
})

test("plural many", () => {
  const value = toValue(parse(parser)("5, 6, s, 8"))
  expect(value.expressions.length).toBe(4)
  expect(value.expressions[0]).toBeInstanceOf(Expression)
  expect(value.expressions[1]).toBeInstanceOf(Expression)
  expect(value.expressions[2]).toBeInstanceOf(Identity)
  expect(value.expressions[3]).toBeInstanceOf(Expression)
  expect(value.expressions[3].expression).toBe("8")
})

test("parens", () => {
  const value = toValue(parse(parser)("(a, b)"))
  expect(value).toBeInstanceOf(Objects)
  expect(value.expressions.length).toBe(2)
  expect(value.expressions[0]).toBeInstanceOf(Identity)
  expect(value.expressions[1]).toBeInstanceOf(Identity)
})

test("plural arithmetic", () => {
  const value = toValue(parse(parser)("5 + 1, 6 + 1"))
  expect(value).toBeInstanceOf(Objects)
  expect(value.expressions.length).toBe(2)
  expect(value.expressions[0]).toBeInstanceOf(Arithmetic)
  expect(value.expressions[1]).toBeInstanceOf(Arithmetic)
})

test("parens deep", () => {
  const value = toValue(parse(parser)("3, (6, (5) + 2)"))
  expect(value).toBeInstanceOf(Objects)
  expect(value.expressions.length).toBe(2)
  expect(value.expressions[0]).toBeInstanceOf(Expression)
  expect(value.expressions[1]).toBeInstanceOf(Objects)
  expect(value.expressions[1].expressions.length).toBe(2)
})

test("single assignment", () => {
  const value = toValue(parse(parser)("k: 5"))
  expect(value).toBeInstanceOf(Assignment)
  expect(value.keys[0]).toBe("k")
  expect(value.expressions[0]).toBeInstanceOf(Expression)
  expect(value.expressions[0].expression).toBe("5")
})

test("plural assignments", () => {
  const value = toValue(parse(parser)("k: 6, l: 7"))
  expect(value).toBeInstanceOf(Objects)
  expect(value.expressions.length).toBe(2)
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
