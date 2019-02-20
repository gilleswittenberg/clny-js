const {
  toValue,
  parse
} = require("arcsecond")
const scope = require("../../../parsers/scope/scope")

test("expression", () => {
  const content = "3"
  const value = toValue(parse(scope)(content))
  expect(value[0].value.value).toBe(3)
  expect(value[0].value.type).toBe("Number")
})

test("assignment", () => {
  const content = "k: 4"
  const value = toValue(parse(scope)(content))
  expect(value[0].keys).toEqual(["k"])
  expect(value[0].expressions[0].value.value).toBe(4)
})

test("assignment", () => {
  const content = "m: 8; n:9"
  const value = toValue(parse(scope)(content))
  expect(value.length).toBe(2)
})

test("array", () => {
  const content = "arr: 5, 6"
  const value = toValue(parse(scope)(content))
  expect(value[0].keys).toEqual(["arr"])
  expect(value[0].expressions[0].value.value).toBe(5)
  expect(value[0].expressions[1].value.value).toBe(6)
})

test("multiline array", () => {

  /* eslint-disable indent */
const content = `array:
  7
  8
`
  /* eslint-enable */
  const value = toValue(parse(scope)(content))
  expect(value[0].keys).toEqual(["array"])
  expect(value[0].expressions[0].value.value).toBe(7)
  expect(value[0].expressions[1].value.value).toBe(8)
})

test("multiline indented array", () => {
  /* eslint-disable indent */
const content = `arrayMD:
- 9
- 10
`
  /* eslint-enable */
  const value = toValue(parse(scope)(content))
  expect(value[0].keys).toEqual(["arrayMD"])
  expect(value[0].expressions[0].value.value).toBe(9)
  expect(value[0].expressions[1].value.value).toBe(10)
})

// @TODO: Fix alias to scope
/*
test("named array", () => {
  const content = "array: k: 7, l: 8"
  const value = toValue(parse(scope)(content))
  expect(value[0].keys).toEqual(["array"])
  expect(value[0].expressions[0].value.value).toBe(7)
  expect(value[1].expressions[0].value.value).toBe(8)
})
*/

test("indented scope", () => {
  /* eslint-disable indent */
const content = `scope
  k: 5
  l: 6
key: 9
`
  /* eslint-enable */
  const value = toValue(parse(scope)(content))
  expect(value[0].keys).toEqual(["scope"])
  expect(value[0].expressions.length).toBe(2)
  expect(value.length).toBe(2)
})

test("indented deep scope", () => {
  /* eslint-disable indent */
const content = `scope:
  deep:
    k: 5
    l: 6
`
  /* eslint-enable */
  const value = toValue(parse(scope)(content))
  expect(value[0].keys).toEqual(["scope"])
  expect(value[0].expressions[0].keys).toEqual(["deep"])
  expect(value[0].expressions[0].expressions.length).toBe(2)
})

test("indented deep scope 2", () => {
  /* eslint-disable indent */
const content = `scope:
  deepone:
    k: 7
  deeptwo:
    l: 8
  deepthree:
    s:
      m: 9
`
  /* eslint-enable */
  const value = toValue(parse(scope)(content))
  expect(value[0].keys).toEqual(["scope"])
  expect(value[0].expressions[0].keys).toEqual(["deepone"])
  expect(value[0].expressions[1].keys).toEqual(["deeptwo"])
  expect(value[0].expressions[2].keys).toEqual(["deepthree"])
  expect(value[0].expressions[2].expressions[0].keys).toEqual(["s"])
  expect(value[0].expressions[2].expressions[0].expressions[0].expressions[0].value.value).toBe(9)
})

test("indented scope root", () => {
  /* eslint-disable indent */
const content = `scope:
  k: 7
two:
  l: 8
`
  /* eslint-enable */
  const value = toValue(parse(scope)(content))
  expect(value[0].keys).toEqual(["scope"])
  expect(value[1].keys).toEqual(["two"])
})

test("indented scope semicolon", () => {
  /* eslint-disable indent */
const content = `scope:
  m: 8; n:9
`
  /* eslint-enable */
  const value = toValue(parse(scope)(content))
  expect(value[0].expressions.length).toBe(2)
})

test("indented scope indented", () => {
  /* eslint-disable indent */
const content = `scope:
- deepone:
  - k: 7
- deeptwo:
  - l: 8
- deepthree:
  - s:
    - m: 9
`
  /* eslint-enable */
  const value = toValue(parse(scope)(content))
  expect(value[0].keys).toEqual(["scope"])
  expect(value[0].expressions[0].keys).toEqual(["deepone"])
  expect(value[0].expressions[1].keys).toEqual(["deeptwo"])
  expect(value[0].expressions[2].keys).toEqual(["deepthree"])
  expect(value[0].expressions[2].expressions[0].keys).toEqual(["s"])
  expect(value[0].expressions[2].expressions[0].expressions[0].expressions[0].value.value).toBe(9)
})
