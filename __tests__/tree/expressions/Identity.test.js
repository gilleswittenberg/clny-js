const Identity = require("../../../tree/expressions/Identity")
const Number = require("../../../tree/expressions/scalars/Number")

describe("Identity", () => {

  test("not existing in scope", () => {
    const identity = new Identity("k")
    expect(() => identity.evaluate()).toThrow("k is not defined in scope")
  })

  test("existing in scope", () => {
    const number = new Number(5)
    const identity = new Identity("k")
    expect(() => identity.evaluate({ k: number })).not.toThrow()
  })
})
