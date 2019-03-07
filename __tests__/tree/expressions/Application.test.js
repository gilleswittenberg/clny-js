const Application = require("../../../tree/expressions/Application")
const Number = require("../../../tree/expressions/scalars/Number")
const Scope = require("../../../tree/expressions/Scope")
const Identity = require("../../../tree/expressions/Identity")

describe("Application", () => {

  test("Scope", () => {
    const number = new Number(5)
    const scope = new Scope(null, number)
    const application = new Application(scope)
    expect(application.evaluate()).toBe(5)
  })

  test("Identity", () => {
    const number = new Number(6)
    const scope = new Scope(null, number)
    const identity = new Identity("sc", scope)
    const application = new Application(identity)
    expect(application.evaluate({ sc: scope })).toBe(6)
  })
})
