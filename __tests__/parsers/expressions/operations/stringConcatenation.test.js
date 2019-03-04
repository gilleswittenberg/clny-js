const {
  toValue,
  parse
} = require("arcsecond")
const expressions = require("../../../../parsers/expressions/expressions")

test("string concatination", () => {
  /* eslint-disable quotes */
  expect(toValue(parse(expressions)(`"Abc" + "def"`)).evaluate()).toBe("Abcdef")
  expect(toValue(parse(expressions)(`"ABc" + "Def" + "GHI"`)).evaluate()).toBe("ABcDefGHI")
  /* eslint-enable */
})
