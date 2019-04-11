const Property = require("../../../tree/expressions/Property")
const Number = require("../../../tree/expressions/scalars/Number")
const Function = require("../../../tree/expressions/scopes/Function")
const Identity = require("../../../tree/expressions/Identity")
const Environment = require("../../../tree/expressions/scopes/Environment")
const Key = require("../../../tree/Key")

describe("Property", () => {

  test("non existing property", () => {
    const parent = new Number(5)
    const chain = new Property(new Key("c"), parent)
    expect(() => chain.evaluate()).toThrow("c is not a property of Number")
  })

  test("existing property", () => {
    const number = new Number(5)
    const environment = new Environment()
    const parent = new Function(null, number, environment)
    const chain = new Property(new Key("apply"), parent)
    expect(chain.evaluate(environment)).toBe(5)
  })

  test("Identity", () => {
    const number = new Number(6)
    const environment = new Environment()
    const scope = new Function(null, number, environment)
    const identity = new Identity("scope", scope)
    const chain = new Property(new Key("apply"), identity)
    environment.set("scope", scope)
    expect(chain.evaluate(environment)).toBe(6)
  })
})
