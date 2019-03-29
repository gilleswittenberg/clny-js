const Environment = require("../../tree/Environment")
const Number = require("../../tree/expressions/scalars/Number")

describe("constructor", () => {

  test("buildIns", () => {
    const environment = new Environment()
    expect(environment.has("String")).toBe(true)
    expect(environment.has("if")).toBe(true)
  })
})

describe("clone", () => {

  test("Environment", () => {
    const environment = new Environment()
    expect(environment.clone()).toBeInstanceOf(Environment)
  })

  test("parent Environment", () => {
    const environment = new Environment()
    const number = new Number(4)
    environment.set("parentNum", number)
    const childEnvironment = new Environment(environment)
    expect(childEnvironment.get("parentNum").value).toEqual(number)
  })
})

describe("getPluralType", () => {

  test("Strings", () => {
    const environment = new Environment()
    expect(environment.has("Strings")).toBe(true)
    expect(environment.get("String").isPluralType).toBe(true)
  })
})

describe("set", () => {

  test("expression", () => {
    const environment = new Environment()
    environment.set("n", new Number(5))
    expect(environment.has("n")).toBe(true)
    expect(environment.get("n").value).toBeInstanceOf(Number)
  })

  test("shadowing", () => {
    const environment = new Environment()
    environment.set("n", new Number(5))
    environment.set("n", new Number(6))
    expect(environment.has("n")).toBe(true)
    expect(environment.get("n").value.value).toBe(6)
  })
})
