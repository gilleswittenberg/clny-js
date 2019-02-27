const {
  toValue,
  parse
} = require("arcsecond")
const string = require("../../../../parsers/expressions/strings/string")

test("string", () => {
  /* eslint-disable quotes */
  expect(toValue(parse(string)(`"Abc"`)).evaluate().value).toBe("Abc")
  expect(toValue(parse(string)(`"D\\""`)).evaluate().value).toBe(`D\\"`)
  expect(toValue(parse(string)(`"AB\n`)).evaluate().value).toBe("AB")
  expect(toValue(parse(string)(`"Abcd   \n`)).evaluate().value).toBe("Abcd")
  expect(toValue(parse(string)(`" Abcd e \n`)).evaluate().value).toBe(" Abcd e")
  /* eslint-enable */
})
