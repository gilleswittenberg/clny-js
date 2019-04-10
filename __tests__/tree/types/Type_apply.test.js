const Type = require("../../../tree/types/Type")
const Number = require("../../../tree/expressions/scalars/Number")
const String = require("../../../tree/expressions/scalars/String")

describe("Type", () => {

  describe("apply", () => {

    test("scalar", () => {
      const number = new Number(5)
      const stringType = new Type("String", null, null, null, null, null, null, true)
      expect(stringType.apply(number).value).toBe("5")
    })

    test("compound", () => {
      const name = new String("John Doe")
      const age = new Number(35)
      const personType = new Type("Person", null, [
        new Type("String", null, null, null, "name", null, true),
        new Type("Number", null, null, null, "age", null, true)
      ])

      const person = personType.apply([name, age])
      person.evaluate()
      expect(person.getProperty("name")).toEqual("John Doe")
      expect(person.getProperty("age")).toEqual(35)
      expect(personType.apply([name, age]).evaluate()).toEqual(["John Doe", 35])
    })

    test("plural", () => {
      const number = new Number(5)
      const number1 = new Number(6)
      const stringType = new Type("String", null, null, null, null, null, null, true)
      const type = new Type("Strings", null, stringType, null, null, null, Infinity)
      expect(type.apply([number, number1]).evaluate()).toEqual(["5", "6"])
    })
  })

  describe("type check", () => {

    test("Product too few arguments", () => {
      const name = new String("John Doe")
      const personType = new Type("Person", null, [
        new Type("String", null, null, null, "name", null, true),
        new Type("Number", null, null, null, "age", null, true)
      ])
      expect(() => { personType.apply([name]) }).toThrow("Invalid number of arguments for Person")
    })

    test("Product too many arguments", () => {
      const name = new String("John Doe")
      const price = new Number(99)
      const extra = new String("extra")
      const personType = new Type("Person", null, [
        new Type("String", null, null, null, "name", null, true),
        new Type("Number", null, null, null, "age", null, true)
      ])
      expect(() => { personType.apply([name, price, extra]) }).toThrow("Invalid number of arguments for Person")
    })

    test("Product incorrect arguments", () => {
      const n = new Number(1)
      const price = new Number(99)
      const personType = new Type("Person", null, [
        new Type("String", null, null, null, "name", null, true),
        new Type("Number", null, null, null, "age", null, true)
      ])
      expect(() => { personType.apply([n, price]) }).toThrow("Invalid argument for Person")
    })
  })
})
