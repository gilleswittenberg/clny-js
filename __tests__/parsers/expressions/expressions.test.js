const {
  toValue,
  parse
} = require("arcsecond")
const parser = require("../../../parsers/expressions/expressions")
const Identity = require("../../../tree/expressions/Identity")
const Expression = require("../../../tree/expressions/Expression")
const Number = require("../../../tree/expressions/scalars/Number")
const String = require("../../../tree/expressions/scalars/String")
const Operation = require("../../../tree/expressions/operations/Operation")
const Assignment = require("../../../tree/expressions/Assignment")
const Statement = require("../../../tree/Statement")

test("single", () => {
  expect(toValue(parse(parser)("5"))).toBeInstanceOf(Number)
  expect(toValue(parse(parser)("id"))).toBeInstanceOf(Identity)
  expect(toValue(parse(parser)("(6)"))).toBeInstanceOf(Number)
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
  expect(value).toBeInstanceOf(Expression)
  expect(value.isPlural).toBe(true)
  expect(value.expressions.length).toBe(2)
  expect(value.expressions[0]).toBeInstanceOf(Number)
  expect(value.expressions[1]).toBeInstanceOf(Number)
})

test("plural", () => {
  const value = toValue(parse(parser)("a, b"))
  expect(value).toBeInstanceOf(Expression)
  expect(value.isPlural).toBe(true)
  expect(value.expressions.length).toBe(2)
  expect(value.expressions[0]).toBeInstanceOf(Identity)
  expect(value.expressions[1]).toBeInstanceOf(Identity)
})

test("plural many", () => {
  const value = toValue(parse(parser)("5, 6, s, 8"))
  expect(value.isPlural).toBe(true)
  expect(value.expressions.length).toBe(4)
  expect(value.expressions[0]).toBeInstanceOf(Number)
  expect(value.expressions[1]).toBeInstanceOf(Number)
  expect(value.expressions[2]).toBeInstanceOf(Identity)
  expect(value.expressions[3]).toBeInstanceOf(Number)
  expect(value.expressions[3].literal).toBe("8")
})

test("parens", () => {
  const value = toValue(parse(parser)("(a, b)"))
  expect(value).toBeInstanceOf(Expression)
  expect(value.isPlural).toBe(true)
  expect(value.expressions.length).toBe(2)
  expect(value.expressions[0]).toBeInstanceOf(Identity)
  expect(value.expressions[1]).toBeInstanceOf(Identity)
})

test("plural arithmetic", () => {
  const value = toValue(parse(parser)("5 + 1, 6 + 1"))
  expect(value).toBeInstanceOf(Expression)
  expect(value.isPlural).toBe(true)
  expect(value.expressions.length).toBe(2)
  expect(value.expressions[0]).toBeInstanceOf(Operation)
  expect(value.expressions[1]).toBeInstanceOf(Operation)
})

test("parens deep", () => {
  const value = toValue(parse(parser)("3, (6, (5) + 2)"))
  expect(value).toBeInstanceOf(Expression)
  expect(value.isPlural).toBe(true)
  expect(value.expressions.length).toBe(2)
  expect(value.expressions[0]).toBeInstanceOf(Expression)
  expect(value.expressions[1]).toBeInstanceOf(Expression)
  expect(value.expressions[1].expressions.length).toBe(2)
})

test("single assignment", () => {
  const value = toValue(parse(parser)("k: 5"))
  expect(value).toBeInstanceOf(Assignment)
  expect(value.keys[0]).toBe("k")
  expect(value.expressions[0]).toBeInstanceOf(Number)
  expect(value.expressions[0].literal).toBe("5")
})

test("plural assignments", () => {
  const value = toValue(parse(parser)("k: 6, l: 7"))
  expect(value).toBeInstanceOf(Expression)
  expect(value.expressions.length).toBe(2)
  expect(value.expressions[0]).toBeInstanceOf(Assignment)
  expect(value.expressions[1]).toBeInstanceOf(Assignment)
})

// @TODO
test("plural assignments", () => {
  //log(toValue(parse(parser)("5: 6")))
  //log(toValue(parse(parser)("arr: 5, 6")))
  //log(toValue(parse(parser)("arr: (7, 8)")))
  //log(toValue(parse(parser)("k: l: 6")))
  //log(toValue(parse(parser)("k: l: 6, m: 7")))
  //log(toValue(parse(parser)("7, k: 8, 9")))
  //log(toValue(parse(parser)("obj: (a: 5, b: 6)")))
})

test("boolean and", () => {
  const value = toValue(parse(parser)("false | true"))
  expect(value).toBeInstanceOf(Operation)
  expect(value.operator).toBe("|")
  expect(value.operands.length).toBe(2)
})

test("string concat", () => {
  // eslint-disable-next-line quotes
  const value = toValue(parse(parser)(`"Abc" + "def"`))
  expect(value).toBeInstanceOf(Operation)
  expect(value.operator).toBe("+")
  expect(value.operands.length).toBe(2)
  expect(value.operands[0]).toBeInstanceOf(String)
  expect(value.operands[1]).toBeInstanceOf(String)
})

test("range", () => {
  const value = toValue(parse(parser)("1,,5"))
  expect(value).toBeInstanceOf(Operation)
  expect(value.operator).toBe(",,")
  expect(value.operands.length).toBe(2)
  expect(value.operands[0]).toBeInstanceOf(Number)
  expect(value.operands[1]).toBeInstanceOf(Number)
})

test("Scalar cast", () => {
  const value = toValue(parse(parser)("String 5"))
  expect(value).toBeInstanceOf(Number)
  expect(value.shouldCast).toBe(true)
  expect(value.castToType).toBe("String")
})

test("Operation cast", () => {
  const value = toValue(parse(parser)("String 5 + 6"))
  expect(value).toBeInstanceOf(Operation)
  expect(value.shouldCast).toBe(true)
  expect(value.castToType).toBe("String")
})

test("Plural cast", () => {
  const value = toValue(parse(parser)("String (5, 6)"))
  expect(value).toBeInstanceOf(Expression)
  expect(value.expressions.length).toBe(2)
  expect(value.expressions[0]).toBeInstanceOf(Number)
  expect(value.expressions[1]).toBeInstanceOf(Number)
  expect(value.shouldCast).toBe(true)
  expect(value.castToType).toBe("String")
})

test("semicolon", () => {
  const value = toValue(parse(parser)("5;6"))
  expect(value.length).toBe(2)
  expect(value[0]).toBeInstanceOf(Number)
  expect(value[1]).toBeInstanceOf(Number)
})

test("semicolon assignments", () => {
  const value = toValue(parse(parser)("k: 5; b: true"))
  expect(value.length).toBe(2)
  expect(value[0]).toBeInstanceOf(Assignment)
  expect(value[1]).toBeInstanceOf(Assignment)
})

test("semicolon many", () => {
  const value = toValue(parse(parser)("5; 6; 9; k: 8; \"str\""))
  expect(value.length).toBe(5)
  expect(value[0]).toBeInstanceOf(Number)
  expect(value[1]).toBeInstanceOf(Number)
  expect(value[2]).toBeInstanceOf(Number)
  expect(value[3]).toBeInstanceOf(Assignment)
  expect(value[4]).toBeInstanceOf(String)
})

test("statement", () => {
  const value = toValue(parse(parser)("return 5"))
  expect(value).toBeInstanceOf(Statement)
  expect(value.name).toBe("return")
  expect(value.expressions.length).toBe(1)
  expect(value.expressions[0]).toBeInstanceOf(Number)
})
