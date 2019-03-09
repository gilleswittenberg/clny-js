const Property = require("../../../tree/expressions/Property")
const Number = require("../../../tree/expressions/scalars/Number")
const FunctionScope = require("../../../tree/expressions/FunctionScope")
const Identity = require("../../../tree/expressions/Identity")

describe("Property", () => {

  test("non existing property", () => {
    const parent = new Number(5)
    const chain = new Property("c", parent)
    expect(() => chain.evaluate()).toThrow("c is not a property of Number")
  })

  test("existing property", () => {
    const number = new Number(5)
    const parent = new FunctionScope(null, number)
    const chain = new Property("apply", parent)
    expect(chain.evaluate()).toBe(5)
  })

  test("Identity", () => {
    const number = new Number(6)
    const scope = new FunctionScope(null, number)
    const identity = new Identity("scope", scope)
    const chain = new Property("apply", identity)
    expect(chain.evaluate({ scope })).toBe(6)
  })
})
