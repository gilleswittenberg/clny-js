const Application = require("../../../tree/expressions/Application")
const Number = require("../../../tree/expressions/scalars/Number")
const FunctionScope = require("../../../tree/expressions/FunctionScope")
const Identity = require("../../../tree/expressions/Identity")

describe("Application", () => {

  test("FunctionScope", () => {
    const number = new Number(5)
    const scope = new FunctionScope(null, number)
    const application = new Application(scope)
    expect(application.evaluate()).toBe(5)
  })

  test("Identity", () => {
    const number = new Number(6)
    const scope = new FunctionScope(null, number)
    const identity = new Identity("scope", scope)
    const application = new Application(identity)
    expect(application.evaluate({ scope })).toBe(6)
  })

  test("FunctionScope Identity deep", () => {
    // { { n } }()(n)
    const n = new Number(13)
    const identity = new Identity("n")
    const scope = new FunctionScope(null, identity)
    const scopeOuter = new FunctionScope(null, scope)
    const application = new Application(scopeOuter)
    const applicationOuter = new Application(application)
    expect(applicationOuter.evaluate({ n })).toEqual(13)
  })

  test("FunctionScope Identity deep 2", () => {
    // { { n }() }(n)
    const n = new Number(14)
    const identity = new Identity("n")
    const scope = new FunctionScope(null, identity)
    const application = new Application(scope)
    const scopeOuter = new FunctionScope(null, application)
    const applicationOuter = new Application(scopeOuter)
    expect(applicationOuter.evaluate({ n })).toEqual(14)
  })
})
