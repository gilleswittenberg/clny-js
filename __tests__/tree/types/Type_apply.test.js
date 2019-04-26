const Type = require("../../../tree/types/Type")
const Number = require("../../../tree/expressions/scalars/Number")

describe("Type", () => {

  describe("apply", () => {

    test("scalar", () => {
      const number = new Number(5)
      const stringType = new Type("String", null, null, null, null, null, null, null, true)
      expect(stringType.apply(number).value).toBe("5")
    })

    test("plural", () => {
      const number = new Number(5)
      const number1 = new Number(6)
      const stringType = new Type("String", null, null, null, null, null, null, null, true)
      const type = new Type("Strings", null, stringType, null, null, null, null, Infinity)
      expect(type.apply([number, number1]).evaluate()).toEqual(["5", "6"])
    })
  })
})
