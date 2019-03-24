const Number = require("../../../../tree/expressions/scalars/Number")
const String = require("../../../../tree/expressions/scalars/String")
const Type = require("../../../../tree/Type")
const Environment = require("../../../../tree/Environment")

describe("Scalar", () => {

  describe("evaluate", () => {

    test("should not cast", () => {
      const number = new Number(2)
      expect(number.evaluate()).toBe(2)
    })

    test("shouldCast", () => {
      const number = new Number(3)
      const environment = new Environment()
      number.shouldCast = true
      number.castToType = environment.types["String"]
      expect(number.evaluate(environment)).toBe("3")
    })
  })

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
