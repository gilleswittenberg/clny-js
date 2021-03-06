const Type = require("../../../tree/types/Type")
const Key = require("../../../tree/Key")
const String = require("../../../tree/expressions/scalars/String")
const Number = require("../../../tree/expressions/scalars/Number")
const Assignment = require("../../../tree/expressions/Assignment")

describe("Type", () => {

  describe("construction", () => {

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
      const type = new Type("Person", null, [new Type("String", null, null, null, new Key("name")), new Type("Bool", null, null, null, new Key("isPerson"))])
      expect(type.name).toBe("Person")
      expect(type.options).toEqual([])
      expect(type.types.length).toBe(2)
      expect(type.types[0]).toBeInstanceOf(Type)
      expect(type.types[0].name).toBe("String")
      expect(type.types[1]).toBeInstanceOf(Type)
      expect(type.types[1].name).toBe("Bool")
    })

    test("unnamed product", () => {
      const type = new Type(null, null, [new Type("String", null, null, null, new Key("name")), new Type("Bool", null, null, null, new Key("isPerson"))])
      expect(type.name).toBe("name: String, isPerson: Bool")
      expect(type.options).toEqual([])
      expect(type.types.length).toBe(2)
      expect(type.types[0]).toBeInstanceOf(Type)
      expect(type.types[0].name).toBe("String")
      expect(type.types[1]).toBeInstanceOf(Type)
      expect(type.types[1].name).toBe("Bool")
    })

    test("named", () => {
      const type = new Type("String", null, null, null, new Key("key"))
      expect(type.name).toBe("String")
      expect(type.fullName).toBe("key: String")
      expect(type.keys[0].name).toBe("key")
    })

    test("aliased", () => {
      const type = new Type("String", null, null, null, [new Key("key"), new Key("alias")])
      expect(type.name).toBe("String")
      expect(type.fullName).toBe("key: alias: String")
      expect(type.keys[0].name).toEqual("key")
      expect(type.keys[1].name).toEqual("alias")
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
      const arg0 = new Type ("String", null, null, null, new Key("s"))
      const arg1 = new Type ("Number", null, null, null, new Key("n"))
      const type = new Type(null, null, new Type("Bool"), [arg0, arg1])
      expect(type.inputTypes.length).toBe(2)
      expect(type.inputTypes[0]).toBeInstanceOf(Type)
      expect(type.inputTypes[0].name).toBe("String")
      expect(type.inputTypes[1]).toBeInstanceOf(Type)
      expect(type.inputTypes[1].name).toBe("Number")
      expect(type.name).toBe("s: String, n: Number -> Bool")
      expect(type.fullName).toBe("s: String, n: Number -> Bool")
    })

    test("Plural", () => {
      const type = new Type("Bools", null, new Type("Bool"), null, null, null, null, Infinity)
      expect(type.name).toBe("Bools")
      expect(type.fullName).toBe("Bools")
      expect(type.types.length).toBe(1)
      expect(type.types[0].name).toBe("Bool")
      expect(type.isPlural).toBe(true)
      expect(type.depth).toEqual([Infinity])
    })

    test("Scalar", () => {
      const type = new Type("Bool", null, null, null, null, null, null, null, true)
      expect(type.name).toBe("Bool")
      expect(type.isPlural).toBe(false)
      expect(type.isScalar).toBe(true)
    })

    test("compound properties", () => {
      const key = new Key("show", "'")
      const expression = new String("Show String")
      const assignment = new Assignment(key, expression)
      const personType = new Type("Product", null, [
        new Type("String", null, null, null, "title", null, null, true),
        new Type("Number", null, null, null, "price", null, null, true)
      ], null, null, null, assignment)

      const title = new String("Shoe")
      const price = new Number(35)
      const product = personType.apply([title, price])
      product.evaluate()
      expect(product.getProperty("show")).toBe("Show String")
    })
  })
})
