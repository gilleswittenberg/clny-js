const Identity = require("../../../tree/expressions/Identity")
const Number = require("../../../tree/expressions/scalars/Number")
const Environment = require("../../../tree/Environment")

describe("Identity", () => {

  test("not existing in scope", () => {
    const identity = new Identity("k")
    expect(() => identity.evaluate(new Environment())).toThrow("k is not defined in environment")
  })

  test("existing in scope", () => {
    const number = new Number(5)
    const identity = new Identity("k")
    expect(() => identity.evaluate(new Environment(null, { k: number }))).not.toThrow()
  })
})
