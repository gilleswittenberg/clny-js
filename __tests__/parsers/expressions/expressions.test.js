const {
  toValue,
  parse
} = require("arcsecond")
const parser = require("../../../parsers/expressions/expressions")
const Identity = require("../../../tree/expressions/Identity")
const Expression = require("../../../tree/expressions/Expression")
const Number = require("../../../tree/expressions/scalars/Number")
const String = require("../../../tree/expressions/scalars/String")
const Type = require("../../../tree/types/Type")
const Application = require("../../../tree/expressions/scopes/Application")
const Operation = require("../../../tree/expressions/operations/Operation")
const Assignment = require("../../../tree/expressions/Assignment")

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

test("plural identities", () => {
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

test("plural arithmetic", () => {
  const value = toValue(parse(parser)("5 + 1, 6 + 1"))
  expect(value).toBeInstanceOf(Expression)
  expect(value.isPlural).toBe(true)
  expect(value.expressions.length).toBe(2)
  expect(value.expressions[0]).toBeInstanceOf(Operation)
  expect(value.expressions[1]).toBeInstanceOf(Operation)
})

test("parentheses", () => {
  const value = toValue(parse(parser)("(a, b)"))
  expect(value).toBeInstanceOf(Expression)
  expect(value.isPlural).toBe(true)
  expect(value.expressions.length).toBe(2)
  expect(value.expressions[0]).toBeInstanceOf(Identity)
  expect(value.expressions[1]).toBeInstanceOf(Identity)
})

test("parentheses deep", () => {
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

test("single assignment plural", () => {
  const value = toValue(parse(parser)("arr: (6, 7)"))
  expect(value).toBeInstanceOf(Assignment)
  expect(value.keys[0]).toBe("arr")
  expect(value.expressions[0].isPlural).toBe(true)
  expect(value.expressions[0].expressions[0]).toBeInstanceOf(Number)
  expect(value.expressions[0].expressions[0].literal).toBe("6")
  expect(value.expressions[0].expressions[1]).toBeInstanceOf(Number)
  expect(value.expressions[0].expressions[1].literal).toBe("7")
})

test("plural assignments", () => {
  const value = toValue(parse(parser)("k: 6, l: 7"))
  expect(value).toBeInstanceOf(Expression)
  expect(value.expressions.length).toBe(2)
  expect(value.expressions[0]).toBeInstanceOf(Assignment)
  expect(value.expressions[1]).toBeInstanceOf(Assignment)
})

test("alias assignments", () => {
  const value = toValue(parse(parser)("key: alias: 8"))
  expect(value).toBeInstanceOf(Assignment)
  expect(value.keys).toEqual(["key"])
  expect(value.expressions[0]).toBeInstanceOf(Assignment)
  expect(value.expressions[0].keys).toEqual(["alias"])
})

test("plural assignment, expression, assignment", () => {
  const value = toValue(parse(parser)("(k: a, 6, m: 7)"))
  expect(value.isPlural).toBe(true)
  expect(value.expressions.length).toBe(3)
  expect(value.expressions[0]).toBeInstanceOf(Assignment)
  expect(value.expressions[1]).toBeInstanceOf(Number)
  expect(value.expressions[2]).toBeInstanceOf(Assignment)
})

test("plural expression, assignment, expression", () => {
  const value = toValue(parse(parser)("7, k: 8, 9, 10"))
  expect(value.isPlural).toBe(true)
  expect(value.expressions.length).toBe(4)
  expect(value.expressions[0]).toBeInstanceOf(Number)
  expect(value.expressions[1]).toBeInstanceOf(Assignment)
  expect(value.expressions[2]).toBeInstanceOf(Number)
  expect(value.expressions[3]).toBeInstanceOf(Number)
})

test("deep", () => {
  const value = toValue(parse(parser)("obj: (a: 5, b: 6)"))
  expect(value).toBeInstanceOf(Assignment)
  expect(value.expressions.length).toBe(1)
  expect(value.expressions[0].expressions[0]).toBeInstanceOf(Assignment)
  expect(value.expressions[0].expressions[1]).toBeInstanceOf(Assignment)
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

describe("cast", () => {

  test("scalar", () => {
    const value = toValue(parse(parser)("String 5"))
    expect(value).toBeInstanceOf(Application)
    expect(value.expressions[0]).toBeInstanceOf(Type)
    expect(value.arguments[0]).toBeInstanceOf(Number)
  })

  test("operation", () => {
    const value = toValue(parse(parser)("String 5 + 6"))
    expect(value).toBeInstanceOf(Application)
    expect(value.expressions[0]).toBeInstanceOf(Type)
    expect(value.arguments[0]).toBeInstanceOf(Operation)
  })

  test("plural", () => {
    const value = toValue(parse(parser)("String (5, 6)"))
    expect(value).toBeInstanceOf(Application)
    expect(value.expressions[0]).toBeInstanceOf(Type)
    expect(value.arguments[0]).toBeInstanceOf(Expression)
    expect(value.arguments[0].isPlural).toBe(true)
  })

  test("assignment", () => {
    const value = toValue(parse(parser)("k: (String 5)"))
    expect(value).toBeInstanceOf(Assignment)
    expect(value.expressions[0]).toBeInstanceOf(Application)
    expect(value.expressions[0].expressions[0]).toBeInstanceOf(Type)
    expect(value.expressions[0].arguments[0]).toBeInstanceOf(Number)
  })
})

describe("semicolon", () => {

  test("expressions", () => {
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
})
