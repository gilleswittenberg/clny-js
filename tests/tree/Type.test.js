const {
  toValue,
  parse
} = require("arcsecond")
const Type = require("../../tree/Type")

test("Null", () => {
  const nullType = new Type("Null")
  expect(nullType.name).toBe("Null")
  expect(nullType.options[0] instanceof Type).toBeTruthy()
  expect(nullType.options[0].name).toBe("Null")
  expect(nullType.types[0].name).toBe("Null")
  expect(nullType.inputTypes).toEqual([])
  expect(nullType.isPlural).toBe(false)
  expect(nullType.isFunction).toBe(false)
})

test("True", () => {
  const trueType = new Type("True")
  expect(trueType.name).toBe("True")
  expect(trueType.options[0] instanceof Type).toBeTruthy()
  expect(trueType.options[0].name).toBe("True")
  expect(trueType.types[0].name).toBe("True")
})

test("Bool", () => {
  const boolType = new Type("Bool", ["False", "True"])
  expect(boolType.name).toBe("Bool")
  expect(boolType.options.length).toBe(2)
  expect(boolType.options[0] instanceof Type).toBeTruthy()
  expect(boolType.options[0].name).toBe("False")
  expect(boolType.options[1] instanceof Type).toBeTruthy()
  expect(boolType.options[1].name).toBe("True")
  expect(boolType.types[0] instanceof Type).toBeTruthy()
})

test("tuple", () => {
  const tupleType = new Type("Tuple", null, ["String", "Bool"])
  expect(tupleType.name).toBe("Tuple")
  expect(tupleType.options[0]).toBe(tupleType)
  expect(tupleType.types[0].name).toBe("String")
  expect(tupleType.types[1].name).toBe("Bool")
  expect(tupleType.isPlural).toBeTruthy()
})

test("sum", () => {
  const sumType = new Type(null, ["String", "Bool"])
  expect(sumType.name).toBe("String | Bool")

})

test("product", () => {
  const namedType = new Type("String", null, null, null, "key")
  expect(namedType.name).toBe("String")
  expect(namedType.keys).toEqual(["key"])
})

test("named", () => {
  const namedType = new Type("String", null, null, null, "key")
  expect(namedType.name).toBe("String")
  expect(namedType.keys).toEqual(["key"])
})

test("aliased", () => {
  const aliasType = new Type("String", null, null, null, ["key", "alias"])
  expect(aliasType.name).toBe("String")
  expect(aliasType.keys).toEqual(["key", "alias"])
})

test("function", () => {
  const functionType = new Type(null, null, "Bool", ["String", "Number"])
  expect(functionType.inputTypes.length).toBe(2)
  expect(functionType.inputTypes[0].name).toBe("String")
  expect(functionType.inputTypes[1].name).toBe("Number")
  expect(functionType.name).toBe("String, Number -> Bool")
})
