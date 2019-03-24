const { isString, isArray, isFunction } = require("../../utils/is")

test("isString", () => {
  expect(isString("")).toBe(true)
})

test("isArray", () => {
  expect(isArray([])).toBe(true)
})

test("isFunction", () => {
  expect(isFunction(() => {})).toBe(true)
})
