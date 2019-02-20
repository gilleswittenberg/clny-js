const {
  toValue,
  parse
} = require("arcsecond")
const comment = require("../../parsers/comment")

test("eol", () => {
const content = `#comment
5`
  expect(toValue(parse(comment)(content))[1]).toBe("comment")
})

test("eol semicolon", () => {
  const content = "# comment; "
  expect(toValue(parse(comment)(content))[1]).toBe(" comment; ")
})

test("closed", () => {
  const content = "# comment \\# expression"
  expect(toValue(parse(comment)(content))[1]).toBe(" comment ")
})

test("multiline", () => {
const content = `# comment
  multiline
  line 3
expression`
  expect(toValue(parse(comment)(content))[1]).toBe(" comment\n  multiline\n  line 3")
})
