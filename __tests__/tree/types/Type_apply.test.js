const Type = require("../../../tree/types/Type")
const Number = require("../../../tree/expressions/scalars/Number")
const String = require("../../../tree/expressions/scalars/String")

describe("Type", () => {

  describe("apply", () => {

    test("scalar", () => {
      const number = new Number(5)
      const stringType = new Type("String", null, null, null, null, null, true)
      expect(stringType.apply(number).value).toBe("5")
    })

    test("compound", () => {
      const name = new String("John Doe")
      const age = new Number(35)
      const personType = new Type("Person", null, [
        new Type("String", null, null, null, "name", true),
        new Type("Number", null, null, null, "age", true)
      ])
      expect(personType.apply([name, age]).evaluate()).toEqual(["John Doe", 35])
    })

    test("plural", () => {
      const number = new Number(5)
      const number1 = new Number(6)
      const stringType = new Type("String", null, null, null, null, null, true)
      const type = new Type("Strings", null, stringType, null, null, Infinity)
      expect(type.apply([number, number1]).evaluate()).toEqual(["5", "6"])
    })
  })
})
