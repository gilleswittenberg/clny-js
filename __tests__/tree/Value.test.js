const Value = require("../../tree/Value")

test("Null", () => {
  const value = new Value(null)
  expect(value.type).toBe("Null")
})

test("Null as String", () => {
  const value = new Value(null, "String")
  expect(value.type).toBe("String")
  expect(value.value).toBe("null")
})

test("Boolean", () => {
  const value = new Value(true)
  expect(value.value).toBe(true)
  expect(value.type).toBe("Boolean")
})

test("Boolean as Number", () => {
  const value = new Value(true, "Number")
  expect(value.type).toBe("Number")
  // @TODO: Fix
  expect(value.value).toBe(NaN)
})

test("Number", () => {
  const value = new Value(5)
  expect(value.type).toBe("Number")
})

test("Number as String", () => {
  const value = new Value(6, "String")
  expect(value.type).toBe("String")
  expect(value.value).toBe("6")
})

test("String", () => {
  const value = new Value("Abc")
  expect(value.type).toBe("String")
})

test("String as Number", () => {
  const value = new Value("4.2", "Number")
  expect(value.type).toBe("Number")
  expect(value.value).toBe(4.2)
})
