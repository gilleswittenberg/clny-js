const Operation = require("../../../../tree/expressions/operations/Operation")
const Boolean = require("../../../../tree/expressions/scalars/Boolean")
const Number = require("../../../../tree/expressions/scalars/Number")
const String = require("../../../../tree/expressions/scalars/String")

describe("Operation", () => {

  describe("different operands types", () => {

    test("BooleanLogic", () => {
      const operation = new Operation("INFIX", "&", new Number(5), new Boolean(true))
      expect(() => operation.evaluate()).toThrow("Invalid operands for Operation")
    })

    test("Arithmetic", () => {
      const operation = new Operation("INFIX", "+", new Number(5), new Boolean(true))
      expect(() => operation.evaluate()).toThrow("Invalid operands for Operation")
    })

    test("StringConcatenation invalid", () => {
      const operation = new Operation("INFIX", "+", new Number(5), new String(""))
      expect(() => operation.evaluate()).toThrow("Invalid operands for Operation")
    })

    test("StringConcatenation valid", () => {
      const operation = new Operation("INFIX", "+", new String("a"), new String("b"))
      expect(() => operation.evaluate()).not.toThrow("Invalid operands for Operation")
    })
  })
})
