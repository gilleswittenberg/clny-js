const Application = require("../../../../tree/expressions/scopes/Application")
const Number = require("../../../../tree/expressions/scalars/Number")
const FunctionScope = require("../../../../tree/expressions/scopes/FunctionScope")
const Function = require("../../../../tree/expressions/scopes/Function")
const Identity = require("../../../../tree/expressions/Identity")
const Statement = require("../../../../tree/expressions/statements/Statement")
const Environment = require("../../../../tree/expressions/scopes/Environment")
const Type = require("../../../../tree/types/Type")

describe("Application", () => {

  describe("Type cast", () => {

    test("String", () => {
      const number = new Number(5)
      const string = new Type("String")
      const application = new Application(string, number)
      const environment = new Environment()
      expect(application.evaluate(environment)).toBe("5")
    })

    describe("type check", () => {

      test("too many arguments", () => {
        const number = new Number(6)
        const number1 = new Number(7)
        const string = new Type("String")
        const application = new Application(string, [number, number1])
        const environment = new Environment()
        expect(() => { application.evaluate(environment) }).toThrow("Invalid number of arguments for Type casting")
      })
    })
  })

  describe("buildins", () => {

    test("return", () => {
      const number = new Number(5)
      const application = new Application(new Identity("return"), number)
      const environment = new Environment()
      expect(application.evaluate(environment)).toBeInstanceOf(Statement)
    })
  })

  describe("FunctionScope", () => {

    test("Scalar", () => {
      const number = new Number(5)
      const environment = new Environment()
      const functionScope = new FunctionScope(null, number)
      const func = new Function(null, functionScope, environment)
      const application = new Application(func)
      expect(application.evaluate()).toBe(5)
    })

    test("Identity", () => {
      const number = new Number(6)
      const environment = new Environment()
      const functionScope = new FunctionScope(null, number)
      const func = new Function(null, functionScope, environment)
      const identity = new Identity("func", func)
      const application = new Application(identity)
      environment.set("func", func)
      expect(application.evaluate(environment)).toBe(6)
    })

    test("Identity deep", () => {
      // { { n } }()(n)
      const n = new Number(13)
      const environment = new Environment()
      environment.set("n", n)
      const identity = new Identity("n")
      const functionScope = new FunctionScope(null, identity)
      const func = new Function(null, functionScope, environment)
      const funcOuter = new Function(null, func, new Environment())
      const application = new Application(funcOuter)
      const applicationOuter = new Application(application)
      expect(applicationOuter.evaluate(environment)).toEqual(13)
    })

    test("Identity deep 2", () => {
      // { { n }() }(n)
      const n = new Number(14)
      const environment = new Environment()
      environment.set("n", n)
      const identity = new Identity("n")
      const functionScope = new FunctionScope(null, identity)
      const func = new Function(null, functionScope, environment)
      const application = new Application(func)
      const funcOuter = new Function(null, application, new Environment())
      const applicationOuter = new Application(funcOuter)
      expect(applicationOuter.evaluate(environment)).toEqual(14)
    })

    describe("type check", () => {

      test("too few arguments", () => {
        const functionScope = new FunctionScope()
        const func = new Function(new Type(null, null, null, "Number"), functionScope)
        const application = new Application(func)
        const environment = new Environment()
        expect(() => { application.evaluate(environment) }).toThrow("Invalid number of arguments for function application")
      })

      test("too many arguments", () => {
        const functionScope = new FunctionScope()
        const func = new Function(new Type(null, null, null, "Number"), functionScope)
        const application = new Application(func, [new Number(5), new Number(6)])
        const environment = new Environment()
        expect(() => { application.evaluate(environment) }).toThrow("Invalid number of arguments for function application")
      })

      test("wrong argument type", () => {
        const functionScope = new FunctionScope()
        const func = new Function(new Type(null, null, null, "Number"), functionScope)
        const application = new Application(func, new String(""))
        const environment = new Environment()
        expect(() => { application.evaluate(environment) }).toThrow("Invalid argument for function application")
      })
    })
  })
})
