const Number = require("../../../../tree/expressions/scalars/Number")
const String = require("../../../../tree/expressions/scalars/String")
const Type = require("../../../../tree/Type")

describe("Scalar", () => {

  describe("castTo", () => {

    test("Number", () => {
      const number = new Number(5)
      const type = new Type("String")
      expect(number.castTo(type)).toBeInstanceOf(String)
    })

    test("Plural", () => {
      const number = new Number(5)
      const type = new Type("String")
      const result = number.castTo(type, true)
      expect(result.length).toBe(1)
      expect(result[0]).toBeInstanceOf(String)
    })

    test("non existing type", () => {
      const number = new Number(5)
      const type = new Type("NonExisting")
      expect(() => number.castTo(type)).toThrow("NonExisting is not a scalar type")
    })
  })

})
