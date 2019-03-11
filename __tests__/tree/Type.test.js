const Type = require("../../tree/Type")

test("Null", () => {
  const type = new Type("Null")
  expect(type.name).toBe("Null")
  expect(type.fullName).toBe("Null")
  expect(type.options).toEqual([])
  expect(type.types).toEqual([])
  expect(type.inputTypes).toEqual([])
  expect(type.isCompound).toBe(false)
  expect(type.isFunction).toBe(false)
})

test("True", () => {
  const type = new Type("True")
  expect(type.name).toBe("True")
  expect(type.fullName).toBe("True")
  expect(type.options).toEqual([])
  expect(type.types).toEqual([])
  expect(type.inputTypes).toEqual([])
  expect(type.isCompound).toBe(false)
  expect(type.isFunction).toBe(false)
})

test("Bool", () => {
  const type = new Type("Bool", [new Type("False"), new Type("True")])
  expect(type.name).toBe("Bool")
  expect(type.fullName).toBe("Bool")
  expect(type.options.length).toBe(2)
  expect(type.options[0] instanceof Type).toBeTruthy()
  expect(type.options[0].name).toBe("False")
  expect(type.options[1] instanceof Type).toBeTruthy()
  expect(type.options[1].name).toBe("True")
  expect(type.types).toEqual([])
})

test("sum", () => {
  const type = new Type(null, [new Type("String"), new Type("Bool")])
  expect(type.name).toBe("String | Bool")
  expect(type.fullName).toBe("String | Bool")
})

test("tuple", () => {
  const type = new Type("Tuple", null, [new Type("String"), new Type("Bool")])
  expect(type.name).toBe("Tuple")
  expect(type.fullName).toBe("Tuple")
  expect(type.options).toEqual([])
  expect(type.types[0]).toBeInstanceOf(Type)
  expect(type.types[0].name).toBe("String")
  expect(type.types[1]).toBeInstanceOf(Type)
  expect(type.types[1].name).toBe("Bool")
  expect(type.isCompound).toBe(true)
})

test("product", () => {
  const type = new Type("Person", null, [new Type("String", null, null, null, "name"), new Type("Bool", null, null, null, "isPerson")])
  expect(type.name).toBe("Person")
  expect(type.options).toEqual([])
  expect(type.types.length).toBe(2)
  expect(type.types[0]).toBeInstanceOf(Type)
  expect(type.types[0].name).toBe("String")
  expect(type.types[1]).toBeInstanceOf(Type)
  expect(type.types[1].name).toBe("Bool")
})

test("unnamed product", () => {
  const type = new Type(null, null, [new Type("String", null, null, null, "name"), new Type("Bool", null, null, null, "isPerson")])
  expect(type.name).toBe("name: String, isPerson: Bool")
  expect(type.options).toEqual([])
  expect(type.types.length).toBe(2)
  expect(type.types[0]).toBeInstanceOf(Type)
  expect(type.types[0].name).toBe("String")
  expect(type.types[1]).toBeInstanceOf(Type)
  expect(type.types[1].name).toBe("Bool")
})

test("named", () => {
  const type = new Type("String", null, null, null, "key")
  expect(type.name).toBe("String")
  expect(type.fullName).toBe("key: String")
  expect(type.keys).toEqual(["key"])
})

test("aliased", () => {
  const type = new Type("String", null, null, null, ["key", "alias"])
  expect(type.name).toBe("String")
  expect(type.fullName).toBe("key: alias: String")
  expect(type.keys).toEqual(["key", "alias"])
})

test("function", () => {
  const type = new Type(null, null, new Type("Bool"), [new Type("String"), new Type("Number")])
  expect(type.inputTypes.length).toBe(2)
  expect(type.inputTypes[0]).toBeInstanceOf(Type)
  expect(type.inputTypes[0].name).toBe("String")
  expect(type.inputTypes[1]).toBeInstanceOf(Type)
  expect(type.inputTypes[1].name).toBe("Number")
  expect(type.name).toBe("String, Number -> Bool")
})

test("function named arguments", () => {
  const arg0 = new Type ("String", null, null, null, "s")
  const arg1 = new Type ("Number", null, null, null, "n")
  const type = new Type(null, null, new Type("Bool"), [arg0, arg1])
  expect(type.inputTypes.length).toBe(2)
  expect(type.inputTypes[0]).toBeInstanceOf(Type)
  expect(type.inputTypes[0].name).toBe("String")
  expect(type.inputTypes[1]).toBeInstanceOf(Type)
  expect(type.inputTypes[1].name).toBe("Number")
  expect(type.name).toBe("s: String, n: Number -> Bool")
  expect(type.fullName).toBe("s: String, n: Number -> Bool")
})
