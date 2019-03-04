const {
  toValue,
  parse
} = require("arcsecond")
const string = require("../../../../parsers/expressions/scalars/string")

test("string", () => {
  /* eslint-disable quotes */
  expect(toValue(parse(string)(`"Abc"`)).evaluate()).toBe("Abc")
  expect(toValue(parse(string)(`"D\\""`)).evaluate()).toBe(`D\\"`)
  expect(toValue(parse(string)(`"AB\n`)).evaluate()).toBe("AB")
  expect(toValue(parse(string)(`"Abcd   \n`)).evaluate()).toBe("Abcd")
  expect(toValue(parse(string)(`" Abcd e \n`)).evaluate()).toBe(" Abcd e")
  /* eslint-enable */
})
