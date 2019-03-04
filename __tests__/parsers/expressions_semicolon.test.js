const {
  toValue,
  parse
} = require("arcsecond")
const parser = require("../../parsers/expressions")
const Number = require("../../tree/expressions/scalars/Number")
const String = require("../../tree/expressions/scalars/String")
const Assignment = require("../../tree/expressions/Assignment")

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
