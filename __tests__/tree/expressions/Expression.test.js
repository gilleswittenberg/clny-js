const Expression = require("../../../tree/expressions/Expression")
const Number = require("../../../tree/expressions/scalars/Number")
const setVisibilityProperties = require("../../../tree/types/setVisibilityProperties")

describe("Expression", () => {

  test("constructor", () => {
    const expression = new Expression("Number", new Number(3))
    expect(expression.isEvaluated).toBe(false)
    expect(expression.isEmpty).toBe(false)
    expect(expression.isSingle).toBe(true)
    expect(expression.isPlural).toBe(false)
    expect(expression.expressions.length).toBe(1)
    expect(expression.expressions[0]).toBeInstanceOf(Number)
  })

  describe("properties", () => {

    test("single", () => {
      const expression = new Expression("Number", new Number(6))
      expression.evaluate()
      expect(expression.getProperty("is")).toBe(true)
      expect(expression.getProperty("isPlural")).toBe(false)
      expect(expression.getProperty("size")).toBe(1)
    })

    test("plural", () => {
      const expression = new Expression("Numbers", [new Number(7), new Number(8)])
      expression.evaluate()
      expect(expression.getProperty("is")).toBe(true)
      expect(expression.getProperty("isPlural")).toBe(true)
      expect(expression.getProperty("size")).toBe(2)
    })

    test("keys", () => {
      const properties = { name: null, age: null }
      const expression = new Expression ("Product", null, setVisibilityProperties(properties, "DATA"))
      expect(expression.getProperty("keys")).toEqual(["name", "age"])
    })

    test("empty", () => {
      const expression = new Expression("Null")
      expect(expression.getProperty("size")).toBe(0)
    })
  })

  describe("evaluation", () => {

    test("single", () => {
      const expression = new Expression("Number", new Number(4))
      expression.evaluate()
      expect(expression.type).toBe("Number")
      expect(expression.value).toBe(4)
    })
  })
})
