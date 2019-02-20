const {
  toValue,
  parse
} = require("arcsecond")
const comment = require("../../parsers/comment")

test("eol", () => {
  /* eslint-disable indent */
const content = `#comment
5`
  /* eslint-enable */
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
  /* eslint-disable indent */
const content = `# comment
  multiline
  line 3
expression`
  /* eslint-enable */
  expect(toValue(parse(comment)(content))[1]).toBe(" comment\n  multiline\n  line 3")
})
