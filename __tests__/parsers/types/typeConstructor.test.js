const {
  toValue,
  parse
} = require("arcsecond")
const typeConstructor = require("../../../parsers/types/typeConstructor")
const TypeConstructor = require("../../../tree/TypeConstructor")

test("type statement", () => {
  const value = toValue(parse(typeConstructor)("type Null"))
  expect(value).toBeInstanceOf(TypeConstructor)
  expect(value.name).toBe("Null")
  expect(value.type).toBe("Null")
})

test("single", () => {
  const value = toValue(parse(typeConstructor)("False"))
  expect(value).toBeInstanceOf(TypeConstructor)
  expect(value.name).toBe("False")
  expect(value.type).toBe("False")
})

test("sum", () => {
  const value = toValue(parse(typeConstructor)("Boolean: False | True"))
  expect(value).toBeInstanceOf(TypeConstructor)
  expect(value.name).toBe("Boolean")
  //expect(value.type).toBe("False | True")
})
