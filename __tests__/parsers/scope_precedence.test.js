const {
  toValue,
  parse
} = require("arcsecond")
const parser = require("../../parsers/precedence")
const Number = require("../../tree/expressions/scalars/Number")
const String = require("../../tree/expressions/scalars/String")
const Assignment = require("../../tree/expressions/Assignment")
const Scope = require("../../tree/Scope2")

const log = require("../../utils/dev/log")

test("semicolon", () => {
  const value = toValue(parse(parser)("5;6"))
  expect(value).toBeInstanceOf(Scope)
  expect(value.expressions.length).toBe(2)
  expect(value.expressions[0]).toBeInstanceOf(Number)
  expect(value.expressions[1]).toBeInstanceOf(Number)
})

test("semicolon assignments", () => {
  const value = toValue(parse(parser)("k: 5; b: true"))
  expect(value).toBeInstanceOf(Scope)
  expect(value.expressions.length).toBe(2)
  expect(value.expressions[0]).toBeInstanceOf(Assignment)
  expect(value.expressions[1]).toBeInstanceOf(Assignment)
})

test("semicolon many", () => {
  const value = toValue(parse(parser)("5; 6; 9; k: 8; \"str\""))
  expect(value).toBeInstanceOf(Scope)
  expect(value.expressions.length).toBe(5)
  expect(value.expressions[0]).toBeInstanceOf(Number)
  expect(value.expressions[1]).toBeInstanceOf(Number)
  expect(value.expressions[2]).toBeInstanceOf(Number)
  expect(value.expressions[3]).toBeInstanceOf(Assignment)
  expect(value.expressions[4]).toBeInstanceOf(String)
})
