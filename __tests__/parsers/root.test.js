const {
  toValue,
  parse
} = require("arcsecond")
const root = require("../../parsers/root")
const rootScope = root(true)
const Scope = require("../../tree/expressions/scopes/Scope")
const Assignment = require("../../tree/expressions/Assignment")
const Expression = require("../../tree/expressions/Expression")
const Number = require("../../tree/expressions/scalars/Number")
const String = require("../../tree/expressions/scalars/String")
const Operation = require("../../tree/expressions/operations/Operation")
const Application = require("../../tree/expressions/scopes/Application")
const Type = require("../../tree/Type")

describe("root scope", () => {

  test("scalar", () => {
    const content = "key: 5"
    const result = toValue(parse(rootScope)(content))
    expect(result).toBeInstanceOf(Scope)
    expect(result.isRoot).toBe(true)
    expect(result.expressions.length).toBe(1)
    expect(result.expressions[0]).toBeInstanceOf(Assignment)
    expect(result.expressions[0].keys).toEqual(["key"])
    expect(result.expressions[0].expressions[0]).toBeInstanceOf(Number)
  })

  test("plural", () => {
    const content = "array: 6, 7"
    const result = toValue(parse(rootScope)(content))
    expect(result).toBeInstanceOf(Scope)
    expect(result.isRoot).toBe(true)
    expect(result.expressions.length).toBe(1)
    expect(result.expressions[0]).toBeInstanceOf(Assignment)
    expect(result.expressions[0].keys).toEqual(["array"])
    expect(result.expressions[0].expressions[0].isPlural).toBe(true)
    expect(result.expressions[0].expressions[0].expressions[0]).toBeInstanceOf(Number)
    expect(result.expressions[0].expressions[0].expressions[1]).toBeInstanceOf(Number)
  })

  test("typed", () => {
    const content = "b: Boolean true"
    const result = toValue(parse(rootScope)(content))
    expect(result.expressions.length).toBe(1)
    expect(result.expressions[0]).toBeInstanceOf(Assignment)
    expect(result.expressions[0].keys).toEqual(["b"])
    expect(result.expressions[0].expressions[0]).toBeInstanceOf(Application)
  })
})

describe("type", () => {

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
})

describe("function", () => {

  xtest("single line", () => {
    const content = "f: n: Number, m: Number -> Number m + n"
    const result = toValue(parse(rootScope)(content))
    expect(result).toBeInstanceOf(Scope)
    expect(result.expressions.length).toBe(1)
    expect(result.expressions[0]).toBeInstanceOf(Assignment)
    expect(result.expressions[0].expressions.length).toBe(1)
    expect(result.expressions[0].expressions[0]).toBeInstanceOf(Operation)
  })

  test("assignment", () => {
    const content = `concat: s: String, t: String -> String
  s + t
`
    const result = toValue(parse(rootScope)(content))
    expect(result).toBeInstanceOf(Scope)
    expect(result.expressions.length).toBe(1)
    expect(result.expressions[0]).toBeInstanceOf(Scope)
    expect(result.expressions[0].keys).toEqual(["concat"])
    expect(result.expressions[0].shouldCast).toBe(true)
    expect(result.expressions[0].castToType).toBeInstanceOf(Type)
    expect(result.expressions[0].castToType.fullName).toBe("s: String, t: String -> String")
    expect(result.expressions[0].expressions.length).toBe(1)
    expect(result.expressions[0].expressions[0]).toBeInstanceOf(Operation)

  })
})

describe("deep", () => {

  test("assignments", () => {
    const content = `scope:
  k:
    a: 9
  l: 6
my: 9
`
    const result = toValue(parse(rootScope)(content))
    expect(result.expressions.length).toBe(2)
    expect(result.expressions[0]).toBeInstanceOf(Scope)
    expect(result.expressions[0].keys).toEqual(["scope"])
    expect(result.expressions[0].expressions[0]).toBeInstanceOf(Scope)
    expect(result.expressions[0].expressions[0].keys).toEqual(["k"])
    expect(result.expressions[1]).toBeInstanceOf(Assignment)
  })

  test("array", () => {
    const content = `arr:
  "a"
  "b"
`
    const result = toValue(parse(rootScope)(content))
    expect(result.expressions.length).toBe(1)
    expect(result.expressions[0]).toBeInstanceOf(Scope)
    expect(result.expressions[0].keys).toEqual(["arr"])
    expect(result.expressions[0].expressions[0]).toBeInstanceOf(String)
    expect(result.expressions[0].expressions[1]).toBeInstanceOf(String)
  })

  test("empty scope opener", () => {
    const content = `scope:
"a"
`
    expect(() => parse(rootScope)(content)).toThrow("Scope opened without adding expressions")
  })
})

describe("indention", () => {

  test("invalid", () => {
    const content = `key:
    5`
    expect(() => toValue(parse(rootScope)(content))).toThrow("Invalid indention at line: 2")
  })

  test("empty line", () => {
    const content = `key:
  5

  6
`
    expect(() => toValue(parse(rootScope)(content))).not.toThrow()
  })
})

describe("comment", () => {

  test("closed comment", () => {
    const content = "# text \\# 5"
    const result = toValue(parse(rootScope)(content))
    expect(result).toBeInstanceOf(Scope)
    expect(result.isRoot).toBe(true)
    expect(result.expressions.length).toBe(1)
    expect(result.expressions[0]).toBeInstanceOf(Number)
    expect(result.expressions[0].value).toBe(5)
  })

  test("closed comment last", () => {
    const content = "6 # text \\#"
    const result = toValue(parse(rootScope)(content))
    expect(result).toBeInstanceOf(Scope)
    expect(result.isRoot).toBe(true)
    expect(result.expressions.length).toBe(1)
    expect(result.expressions[0]).toBeInstanceOf(Number)
    expect(result.expressions[0].value).toBe(6)
  })

  test("closed comment multi", () => {
    const content = "# text \\#  # text2 \\# 56 # text3 \\#  , 6 # text \\## text2 \\#"
    const result = toValue(parse(rootScope)(content))
    expect(result).toBeInstanceOf(Scope)
    expect(result.isRoot).toBe(true)
    expect(result.expressions.length).toBe(1)
    expect(result.expressions[0]).toBeInstanceOf(Expression)
    expect(result.expressions[0].isPlural).toBe(true)
    expect(result.expressions[0].expressions.length).toBe(2)
  })

  test("comment eol", () => {
    const content = "22 # Five!"
    const result = toValue(parse(rootScope)(content))
    expect(result).toBeInstanceOf(Scope)
    expect(result.isRoot).toBe(true)
    expect(result.expressions.length).toBe(1)
    expect(result.expressions[0]).toBeInstanceOf(Number)
    expect(result.expressions[0].value).toBe(22)
  })

  test("comment line", () => {
    const content = "# only comment on line"
    const result = toValue(parse(rootScope)(content))
    expect(result).toBeInstanceOf(Scope)
    expect(result.isRoot).toBe(true)
    expect(result.expressions.length).toBe(0)
  })

  test("multiline indented comment", () => {
    const content = `# text
  ~giberish@!abc~
"continue"`
    const result = toValue(parse(rootScope)(content))
    expect(result).toBeInstanceOf(Scope)
    expect(result.isRoot).toBe(true)
    expect(result.expressions.length).toBe(1)
    expect(result.expressions[0]).toBeInstanceOf(String)
    expect(result.expressions[0].value).toBe("continue")
  })

  test("multiline deep", () => {
    const content = `k:
  5
  # text
    ~giberish@!abc~
  "continue"`
    const result = toValue(parse(rootScope)(content))
    expect(result).toBeInstanceOf(Scope)
    expect(result.isRoot).toBe(true)
    expect(result.expressions.length).toBe(1)
    expect(result.expressions[0]).toBeInstanceOf(Scope)
    expect(result.expressions[0].expressions[0]).toBeInstanceOf(Number)
    expect(result.expressions[0].expressions[0].value).toBe(5)
    expect(result.expressions[0].expressions[1]).toBeInstanceOf(String)
    expect(result.expressions[0].expressions[1].value).toBe("continue")
  })

  test("multiline gibberish", () => {
    const content = `# text
~giberish@!abc~
5`
    expect(() => toValue(parse(rootScope)(content))).toThrow("Invalid characters at line: 2")
  })
})
