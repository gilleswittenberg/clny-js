const Function = require("../../../../tree/expressions/scopes/Function")
const FunctionScope = require("../../../../tree/expressions/scopes/FunctionScope")
const Number = require("../../../../tree/expressions/scalars/Number")
const Identity = require("../../../../tree/expressions/Identity")
const Environment = require("../../../../tree/expressions/scopes/Environment")
const Type = require("../../../../tree/types/Type")
const Key = require("../../../../tree/Key")

describe("Function", () => {

  describe("properties", () => {

    describe("apply", () => {

      test("apply", () => {
        const functionScope = new FunctionScope(null, new Number(13))
        const environment = new Environment()
        const func = new Function(null, functionScope, environment)
        expect(func.getProperty("apply")()).toBe(13)
      })

      test("apply environment", () => {
        const identity = new Identity(new Key("n"))
        const functionScope = new FunctionScope(null, identity)
        const environment = new Environment()
        environment.set("n", new Number(14))
        const func = new Function(null, functionScope, environment)
        expect(func.getProperty("apply")()).toBe(14)
      })

      test("apply arguments", () => {
        const functionScope = new FunctionScope(null, new Identity(new Key("m")))
        const m = new Number(15)
        const environment = new Environment()
        const type = new Type(null, null, new Type("Number"), [new Type("Number", null, new Type("Number"), null, "m")])
        const func = new Function(type, functionScope, environment)
        expect(func.getProperty("apply")([m])).toBe(15)
      })
    })

    describe("parameters, arity, returnType", () => {

      test("empty parameters", () => {
        const func = new Function(null, new Number(1))
        expect(func.getProperty("parameters")).toBe("")
        expect(func.getProperty("arity")).toBe(0)
        expect(func.getProperty("returnType")).toBe("Any")
      })

      test("function type", () => {
        const type = new Type(null, null, new Type("Number"), [
          new Type("Number", null, null, null, new Key("m")),
          new Type("Number", null, null, null, new Key("n"))
        ])
        const func = new Function(type, new Number(1))
        expect(func.getProperty("parameters")).toBe("m: Number, n: Number")
        expect(func.getProperty("arity")).toBe(2)
        expect(func.getProperty("returnType")).toBe("Number")
      })
    })
  })
})
