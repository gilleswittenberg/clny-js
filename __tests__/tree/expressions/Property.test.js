const Property = require("../../../tree/expressions/Property")
const Number = require("../../../tree/expressions/scalars/Number")
const Function = require("../../../tree/expressions/scopes/Function")
const Identity = require("../../../tree/expressions/Identity")
const Environment = require("../../../tree/expressions/scopes/Environment")

describe("Property", () => {

  test("non existing property", () => {
    const parent = new Number(5)
    const chain = new Property("c", parent)
    expect(() => chain.evaluate()).toThrow("c is not a property of Number")
  })

  test("existing property", () => {
    const number = new Number(5)
    const environment = new Environment()
    const parent = new Function(null, number, environment)
    const chain = new Property("apply", parent)
    expect(chain.evaluate(environment)).toBe(5)
  })

  test("Identity", () => {
    const number = new Number(6)
    const environment = new Environment()
    const scope = new Function(null, number, environment)
    const identity = new Identity("scope", scope)
    const chain = new Property("apply", identity)
    environment.set("scope", scope)
    expect(chain.evaluate(environment)).toBe(6)
  })
})
