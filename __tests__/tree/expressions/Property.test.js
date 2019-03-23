const Property = require("../../../tree/expressions/Property")
const Number = require("../../../tree/expressions/scalars/Number")
const FunctionScope = require("../../../tree/expressions/FunctionScope")
const Identity = require("../../../tree/expressions/Identity")
const Environment = require("../../../tree/Environment")

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
    const environment = new Environment()
    expect(chain.evaluate(environment)).toBe(5)
  })

  test("Identity", () => {
    const number = new Number(6)
    const scope = new FunctionScope(null, number)
    const identity = new Identity("scope", scope)
    const chain = new Property("apply", identity)
    const environment = new Environment()
    environment.addKey("scope", scope)
    expect(chain.evaluate(environment)).toBe(6)
  })
})
