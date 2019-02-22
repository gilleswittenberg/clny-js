const {
  toValue,
  parse
} = require("arcsecond")
const lines = require("../../../parsers/scope/lines")

test("semicolon", () => {
  const content = "kk: 78; ll: 89"
  const value = toValue(parse(lines)(content))
  expect(value.length).toBe(2)
})

test("semicolon", () => {
  /* eslint-disable indent */
const content = `
# comment
kk
  ll: 89
  mm: 90
`
  /* eslint-enable */
  const value = toValue(parse(lines)(content))
  expect(value.length).toBe(3)
})
