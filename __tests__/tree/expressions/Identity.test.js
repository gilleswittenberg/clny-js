const Identity = require("../../../tree/expressions/Identity")
const Key = require("../../../tree/Key")
const Number = require("../../../tree/expressions/scalars/Number")
const Environment = require("../../../tree/expressions/scopes/Environment")

describe("Identity", () => {

  describe("construct", () => {

    test("self", () => {
      const identity = new Identity(null, true)
      expect(identity.self).toBe(true)
      expect(identity.key).toBe(null)
    })

    test("self reference", () => {
      const identity = new Identity(new Key("prop"), true)
      expect(identity.self).toBe(true)
      expect(identity.key.name).toBe("prop")
    })
  })

  describe("evaluate", () => {

    test("not existing in scope", () => {
      const identity = new Identity(new Key("k"))
      expect(() => identity.evaluate(new Environment())).toThrow("k is not defined in environment")
    })

    test("existing in scope", () => {
      const number = new Number(5)
      const identity = new Identity(new Key("k"))
      const environment = new Environment()
      environment.set("k", number)
      expect(() => identity.evaluate(environment)).not.toThrow()
    })
  })
})
