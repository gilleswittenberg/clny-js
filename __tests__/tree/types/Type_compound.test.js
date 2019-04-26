const Type = require("../../../tree/types/Type")
const Number = require("../../../tree/expressions/scalars/Number")
const String = require("../../../tree/expressions/scalars/String")
const Key = require("../../../tree/Key")
const Assignment = require("../../../tree/expressions/Assignment")

describe("Type compound", () => {

  describe("construct", () => {

    test("data properties", () => {
      const name = new String("John Doe")
      const age = new Number(35)
      const personType = new Type("Person", null, [
        new Type("String", null, null, null, "name", null, null, true),
        new Type("Number", null, null, null, "age", null, null, true)
      ])

      const person = personType.apply([name, age])
      person.evaluate()
      expect(person.getProperty("name")).toEqual("John Doe")
      expect(person.getProperty("age")).toEqual(35)
      expect(personType.apply([name, age]).evaluate()).toEqual(["John Doe", 35])
    })

    test("defaultValue", () => {
      const name = new String("Jane Doe")
      const personType = new Type("Person", null, [
        new Type("String", null, null, null, "name", null, null, null, true),
        new Type("Number", null, null, null, "age", null, null, null, true, 32)
      ])
      const person = personType.apply([name])
      person.evaluate()
      expect(person.getProperty("age")).toBe(32)
    })

    test("convenience property", () => {
      const key = new Key("show", "'")
      const str = new String("Show String")
      const properties = new Assignment(key, str)
      const personType = new Type("Product", null, [
        new Type("String", null, null, null, "title", null, null, true),
        new Type("Number", null, null, null, "price", null, null, true)
      ], null, null, null, properties)
      const title = new String("Shoe")
      const price = new Number(35)
      const person = personType.apply([title, price])
      person.evaluate()
      expect(person.getProperty("show")).toBe("Show String")
    })
  })

  describe("type check", () => {

    test("Product too few arguments", () => {
      const name = new String("John Doe")
      const personType = new Type("Person", null, [
        new Type("String", null, null, null, "name", null, null, null, true),
        new Type("Number", null, null, null, "age", null, null, null, true)
      ])
      expect(() => { personType.apply([name]) }).toThrow("Invalid number of arguments for Person")
    })

    test("Product too many arguments", () => {
      const name = new String("John Doe")
      const price = new Number(99)
      const extra = new String("extra")
      const personType = new Type("Person", null, [
        new Type("String", null, null, null, "name", null, null, null, true),
        new Type("Number", null, null, null, "age", null, null, null, true)
      ])
      expect(() => { personType.apply([name, price, extra]) }).toThrow("Invalid number of arguments for Person")
    })

    test("Product incorrect arguments", () => {
      const n = new Number(1)
      const price = new Number(99)
      const personType = new Type("Person", null, [
        new Type("String", null, null, null, "name", null, null, null, true),
        new Type("Number", null, null, null, "age", null, null, null, true)
      ])
      expect(() => { personType.apply([n, price]) }).toThrow("Invalid argument for Person")
    })
  })
})
