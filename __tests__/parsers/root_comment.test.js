const {
  toValue,
  parse
} = require("arcsecond")
const root = require("../../parsers/root")
const rootScope = root(true)
const Scope = require("../../tree/expressions/scopes/Scope")
const Expression = require("../../tree/expressions/Expression")
const Number = require("../../tree/expressions/scalars/Number")
const String = require("../../tree/expressions/scalars/String")

describe("root comment", () => {

  test("closed comment", () => {
    const content = "# text \\# 5"
    const result = toValue(parse(rootScope)(content))
    expect(result).toBeInstanceOf(Scope)
    expect(result.expressions.length).toBe(1)
    expect(result.expressions[0]).toBeInstanceOf(Number)
    expect(result.expressions[0].value).toBe(5)
  })

  test("closed comment last", () => {
    const content = "6 # text \\#"
    const result = toValue(parse(rootScope)(content))
    expect(result).toBeInstanceOf(Scope)
    expect(result.expressions.length).toBe(1)
    expect(result.expressions[0]).toBeInstanceOf(Number)
    expect(result.expressions[0].value).toBe(6)
  })

  test("closed comment multi", () => {
    const content = "# text \\#  # text2 \\# 56 # text3 \\#  , 6 # text \\## text2 \\#"
    const result = toValue(parse(rootScope)(content))
    expect(result).toBeInstanceOf(Scope)
    expect(result.expressions.length).toBe(1)
    expect(result.expressions[0]).toBeInstanceOf(Expression)
    expect(result.expressions[0].isPlural).toBe(true)
    expect(result.expressions[0].expressions.length).toBe(2)
  })

  test("comment eol", () => {
    const content = "22 # Five!"
    const result = toValue(parse(rootScope)(content))
    expect(result).toBeInstanceOf(Scope)
    expect(result.expressions.length).toBe(1)
    expect(result.expressions[0]).toBeInstanceOf(Number)
    expect(result.expressions[0].value).toBe(22)
  })

  test("comment line", () => {
    const content = "# only comment on line"
    const result = toValue(parse(rootScope)(content))
    expect(result).toBeInstanceOf(Scope)
    expect(result.expressions.length).toBe(0)
  })

  test("multiline indented comment", () => {
    const content = `# text
  ~giberish@!abc~
"continue"`
    const result = toValue(parse(rootScope)(content))
    expect(result).toBeInstanceOf(Scope)
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
