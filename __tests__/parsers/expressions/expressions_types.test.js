const {
  toValue,
  parse
} = require("arcsecond")
const expressions = require("../../../parsers/expressions/expressions")
const Expression = require("../../../tree/expressions/Expression")
const Assignment = require("../../../tree/expressions/Assignment")
const Operation = require("../../../tree/expressions/operations/Operation")
const Type = require("../../../tree/types/Type")
const FunctionType = require("../../../tree/types/FunctionType")

describe("expressions types", () => {

  test("single", () => {
    const value = toValue(parse(expressions)("False"))
    expect(value).toBeInstanceOf(Type)
    expect(value.name).toBe("False")
  })

  test("single embellishment", () => {
    const value = toValue(parse(expressions)("Boolean?"))
    expect(value).toBeInstanceOf(Type)
    expect(value.name).toBe("Boolean")
    expect(value.embellishments.length).toBe(1)
    expect(value.embellishments[0].property).toBe("Optional")
  })

  test("named", () => {
    const value = toValue(parse(expressions)("k: String"))
    expect(value).toBeInstanceOf(Assignment)
    expect(value.keys[0].name).toBe("k")
    expect(value.expressions[0].name).toBe("String")
  })

  test("sum", () => {
    const value = toValue(parse(expressions)("Number | Boolean"))
    expect(value).toBeInstanceOf(Operation)
    expect(value.operands[0]).toBeInstanceOf(Type)
    expect(value.operands[0].name).toBe("Number")
    expect(value.operands[1]).toBeInstanceOf(Type)
    expect(value.operands[1].name).toBe("Boolean")
  })

  test("named sum", () => {
    const value = toValue(parse(expressions)("a: Number | Boolean"))
    expect(value).toBeInstanceOf(Assignment)
    expect(value.expressions[0]).toBeInstanceOf(Operation)
    expect(value.expressions[0].operands.length).toBe(2)
    expect(value.expressions[0].operands[0]).toBeInstanceOf(Type)
    expect(value.expressions[0].operands[1]).toBeInstanceOf(Type)
  })

  test("tuple", () => {
    const value = toValue(parse(expressions)("String, String"))
    expect(value).toBeInstanceOf(Expression)
    expect(value.expressions.length).toBe(2)
    expect(value.expressions[0]).toBeInstanceOf(Type)
    expect(value.expressions[0].name).toBe("String")
    expect(value.expressions[1]).toBeInstanceOf(Type)
    expect(value.expressions[1].name).toBe("String")
  })

  test("tuple, sum", () => {
    const value = toValue(parse(expressions)("String, Number | Bool"))
    expect(value).toBeInstanceOf(Expression)
    expect(value.expressions.length).toBe(2)
    expect(value.expressions[0]).toBeInstanceOf(Type)
    expect(value.expressions[1]).toBeInstanceOf(Operation)
    expect(value.expressions[1].operands.length).toBe(2)
    expect(value.expressions[1].operands[0]).toBeInstanceOf(Type)
    expect(value.expressions[1].operands[1]).toBeInstanceOf(Type)
  })

  test("compound", () => {
    const value = toValue(parse(expressions)("name: String, age: Number"))
    expect(value).toBeInstanceOf(Expression)
    expect(value.expressions.length).toBe(2)
    expect(value.expressions[0]).toBeInstanceOf(Assignment)
    expect(value.expressions[0].keys[0].name).toBe("name")
    expect(value.expressions[0].expressions[0]).toBeInstanceOf(Type)
    expect(value.expressions[1]).toBeInstanceOf(Assignment)
    expect(value.expressions[1].keys[0].name).toBe("age")
    expect(value.expressions[1].expressions[0]).toBeInstanceOf(Type)
  })

  test("function", () => {
    const value = toValue(parse(expressions)("name: String, age: Number -> Boolean"))
    expect(value).toBeInstanceOf(FunctionType)
    expect(value.inputs[0].expressions.length).toBe(2)
    expect(value.inputs[0].expressions[0]).toBeInstanceOf(Assignment)
    expect(value.inputs[0].expressions[0].keys[0].name).toBe("name")
    expect(value.inputs[0].expressions[0].expressions[0]).toBeInstanceOf(Type)
    expect(value.inputs[0].expressions[0].expressions[0].name).toBe("String")
    expect(value.inputs[0].expressions[1]).toBeInstanceOf(Assignment)
    expect(value.inputs[0].expressions[1].keys[0].name).toBe("age")
    expect(value.inputs[0].expressions[1].expressions[0]).toBeInstanceOf(Type)
    expect(value.inputs[0].expressions[1].expressions[0].name).toBe("Number")
    expect(value.returnType).toBeInstanceOf(Type)
    expect(value.returnType.name).toBe("Boolean")
  })

  test("function to tuple", () => {
    const value = toValue(parse(expressions)("n: Number -> Number, Boolean"))
    expect(value).toBeInstanceOf(FunctionType)
    expect(value.inputs.length).toBe(1)
    expect(value.inputs[0]).toBeInstanceOf(Assignment)
    expect(value.inputs[0].keys[0].name).toBe("n")
    expect(value.inputs[0].expressions[0]).toBeInstanceOf(Type)
    expect(value.inputs[0].expressions[0].name).toBe("Number")
    expect(value.returnType).toBeInstanceOf(Expression)
    expect(value.returnType.expressions.length).toBe(2)
    expect(value.returnType.expressions[0]).toBeInstanceOf(Type)
    expect(value.returnType.expressions[0].name).toBe("Number")
    expect(value.returnType.expressions[1]).toBeInstanceOf(Type)
    expect(value.returnType.expressions[1].name).toBe("Boolean")
  })

  test("function embellishment", () => {
    const value = toValue(parse(expressions)("String -> String@"))
    expect(value).toBeInstanceOf(FunctionType)
    expect(value.returnType.name).toBe("String")
    expect(value.returnType.embellishments.length).toBe(1)
    expect(value.returnType.embellishments[0].property).toBe("Async")
  })
})
