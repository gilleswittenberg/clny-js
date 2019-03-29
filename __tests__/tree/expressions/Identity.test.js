const Identity = require("../../../tree/expressions/Identity")
const Number = require("../../../tree/expressions/scalars/Number")
const Environment = require("../../../tree/expressions/scopes/Environment")

describe("Identity", () => {

  describe("construc", () => {

    test("self", () => {
      const identity = new Identity(".")
      expect(identity.self).toBe(true)
      expect(identity.key).toBe(null)
    })

    test("self reference", () => {
      const identity = new Identity(".prop")
      expect(identity.self).toBe(true)
      expect(identity.key).toBe("prop")
    })
  })

  describe("evaluate", () => {

    test("not existing in scope", () => {
      const identity = new Identity("k")
      expect(() => identity.evaluate(new Environment())).toThrow("k is not defined in environment")
    })

    test("existing in scope", () => {
      const number = new Number(5)
      const identity = new Identity("k")
      const environment = new Environment()
      environment.set("k", number)
      expect(() => identity.evaluate(environment)).not.toThrow()
    })
  })
})
