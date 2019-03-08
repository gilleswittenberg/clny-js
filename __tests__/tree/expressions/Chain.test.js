const Chain = require("../../../tree/expressions/Chain")
const Number = require("../../../tree/expressions/scalars/Number")
const Scope = require("../../../tree/expressions/Scope")
const Identity = require("../../../tree/expressions/Identity")

describe("Chain", () => {

  test("non existing property", () => {
    const parent = new Number(5)
    const chain = new Chain("c", parent)
    expect(() => chain.evaluate()).toThrow("c is not a property of Number")
  })

  test("existing property", () => {
    const number = new Number(5)
    const parent = new Scope(null, number)
    const chain = new Chain("apply", parent)
    expect(chain.evaluate()).toBe(5)
  })

  test("Identity", () => {
    const number = new Number(6)
    const scope = new Scope(null, number)
    const identity = new Identity("scope", scope)
    const chain = new Chain("apply", identity)
    expect(chain.evaluate({ scope })).toBe(6)
  })
})
