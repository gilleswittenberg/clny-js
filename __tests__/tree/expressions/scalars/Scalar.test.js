const Number = require("../../../../tree/expressions/scalars/Number")

describe("Scalar", () => {

  describe("evaluate", () => {

    test("value", () => {
      const number = new Number(2)
      expect(number.evaluate()).toBe(2)
    })
  })
})
