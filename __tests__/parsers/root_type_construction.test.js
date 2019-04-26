const {
  toValue,
  parse
} = require("arcsecond")
const root = require("../../parsers/root")
const rootScope = root()
const Scope = require("../../tree/expressions/scopes/Scope")
const Type = require("../../tree/types/Type")

describe("root type construction", () => {

  // @TODO
  xtest("single line", () => {
    const content = "OptionalBoolean: Null | Boolean"
    const result = toValue(parse(rootScope)(content))
    expect(result).toBeInstanceOf(Scope)
    expect(result.types.OptionalBoolean).toBeInstanceOf(Type)
    expect(result.types.OptionalBoolean.options.length).toBe(2)
    expect(result.expressions.length).toBe(0)
  })

  test("multiline", () => {
    const content = `Product:
  title: String
  price: Float
`
    const result = toValue(parse(rootScope)(content))
    expect(result.types.Product).toBeInstanceOf(Type)
    expect(result.types.Product.types.length).toBe(2)
    expect(result.expressions.length).toBe(0)
  })

  test("properties", () => {
    const content = `Person:
  name: String
  'prop: "a"
  _private: "p"
`
    const result = toValue(parse(rootScope)(content))
    expect(result.types.Person).toBeInstanceOf(Type)
    expect(result.types.Person.types.length).toBe(1)
    expect(result.types.Person.properties).toEqual({
      prop: { property: "a", visibility: "CONVENIENCE" },
      private: { property: "p", visibility: "PRIVATE" }
    })
    expect(result.expressions.length).toBe(0)
  })

  test("default value", () => {
    const content = `Compound:
  name: String
  s: "a"
`
    const result = toValue(parse(rootScope)(content))
    expect(result.types.Compound.types.length).toBe(2)
    expect(result.types.Compound.types[0].name).toBe("String")
    expect(result.types.Compound.types[1].name).toBe("String")
    expect(result.types.Compound.types[1].isScalar).toBe(true)
    expect(result.types.Compound.types[1].keys[0].name).toBe("s")
    expect(result.types.Compound.types[1].hasDefaultValue).toBe(true)
    expect(result.types.Compound.types[1].defaultValue.value).toBe("a")
  })

  test("default typed value", () => {
    const content = `Compound:
  name: String
  t: String "b"
`
    const result = toValue(parse(rootScope)(content))
    expect(result.types.Compound.types.length).toBe(2)
    expect(result.types.Compound.types[0].name).toBe("String")
    expect(result.types.Compound.types[1].name).toBe("Application")
    expect(result.types.Compound.types[1].isScalar).toBe(true)
    expect(result.types.Compound.types[1].keys[0].name).toBe("t")
    expect(result.types.Compound.types[1].hasDefaultValue).toBe(true)
    expect(result.types.Compound.types[1].defaultValue.type).toBe("Application")
    expect(result.types.Compound.types[1].defaultValue.arguments[0].value).toBe("b")
  })

  test("function property", () => {
    const content = `Compound:
  name: String
  f: Boolean -> String "c"
`
    const result = toValue(parse(rootScope)(content))
    expect(result.types.Compound.types.length).toBe(2)
    expect(result.types.Compound.types[0].name).toBe("String")
    expect(result.types.Compound.types[1].name).toBe("Application")
    expect(result.types.Compound.types[1].isScalar).toBe(true)
    expect(result.types.Compound.types[1].keys[0].name).toBe("f")
    expect(result.types.Compound.types[1].hasDefaultValue).toBe(true)
    expect(result.types.Compound.types[1].defaultValue.type).toBe("Application")
    expect(result.types.Compound.types[1].defaultValue.expressions[0].inputs[0].name).toBe("Boolean")
    expect(result.types.Compound.types[1].defaultValue.expressions[0].returnType.name).toBe("String")
    expect(result.types.Compound.types[1].defaultValue.arguments[0].value).toBe("c")
  })

  test("function property self reference", () => {
    const content = `Compound:
  name: String
  shout: Boolean -> String .name.toUppercase
`
    const result = toValue(parse(rootScope)(content))
    expect(result.types.Compound.types.length).toBe(2)
  })

})
